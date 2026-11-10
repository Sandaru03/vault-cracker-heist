const eventManager = require('../events/eventManager');
const bananaApiService = require('../services/bananaApiService');
const { pool } = require('../config/db');

/**
 * Controller: Get live cipher puzzle from Banana REST API (Module 2: Interoperability)
 * Fetches the visual equation image and integer solution from Marc Conrad's external API.
 */
async function getCipherPuzzle(level) {
  const puzzleData = await bananaApiService.fetchPuzzle();
  return {
    imageUrl: puzzleData.question,
    hint: 'Solve visual banana equation and input 0-9 code',
    solution: puzzleData.solution,
    source: puzzleData.source
  };
}

// Viva comment: Controller to start a new infiltration mission with Banana API puzzle
async function startMission(req, res) {
  try {
    const agentId = req.body.agentId || (req.agent ? req.agent.id : 9999);
    const puzzle = await getCipherPuzzle(1);

    // Event: Emit timer start event (60s armed)
    eventManager.emit('timer:start', { agentId, level: 1 });

    return res.status(200).json({
      success: true,
      level: 1,
      maxLevels: 3,
      timer: 60,
      alertCount: 0,
      puzzle: {
        imageUrl: puzzle.imageUrl,
        hint: puzzle.hint
      },
      _internalSolution: puzzle.solution
    });
  } catch (error) {
    console.error('[START MISSION ERROR]:', error);
    return res.status(500).json({ success: false, message: 'Failed to initialize mission.' });
  }
}

// Viva comment: Controller to evaluate keypad submission, handle level progression & alerts
async function submitAnswer(req, res) {
  try {
    const { answer, expectedSolution, currentLevel, alertCount, agentId } = req.body;
    const isCorrect = String(answer).trim() === String(expectedSolution).trim();

    // Event: Emit keypad button press event
    eventManager.emit('keypad:press', { key: answer });

    // Case 1: Operative solved puzzle correctly
    if (isCorrect) {
      if (currentLevel < 3) {
        // Advance to next security layer
        const nextLevel = currentLevel + 1;
        const nextPuzzle = await getCipherPuzzle(nextLevel);

        // Event: Level success
        eventManager.emit('vault:success', { level: nextLevel, vaultCracked: false, agentId });

        return res.status(200).json({
          success: true,
          correct: true,
          level: nextLevel,
          vaultCracked: false,
          alertCount: alertCount,
          puzzle: {
            imageUrl: nextPuzzle.imageUrl,
            hint: nextPuzzle.hint
          },
          _internalSolution: nextPuzzle.solution,
          message: `Layer ${currentLevel} decrypted! Infiltrating Layer ${nextLevel}.`
        });
      } else {
        // Layer 3 solved: Vault Cracked!
        if (agentId && agentId !== 9999) {
          try {
            await pool.query(
              'UPDATE agent_stats SET score = score + 100, unlocked_badges = ? WHERE agent_id = ?',
              ['VAULT_BREAKER', agentId]
            );
          } catch (dbErr) {
            console.error('[DB UPDATE ERROR]:', dbErr);
          }
        }

        // Event: Full Vault Cracked
        eventManager.emit('vault:success', { level: 3, vaultCracked: true, agentId });

        return res.status(200).json({
          success: true,
          correct: true,
          level: 3,
          vaultCracked: true,
          message: 'CIPHER DECRYPTED! VAULT COMPROMISED SUCCESSFULLY!'
        });
      }
    }

    // Case 2: Incorrect code entered or timer expired (3-Alert strikes)
    const newAlertCount = (alertCount || 0) + 1;

    // Alert 1: Strike 1 warning
    if (newAlertCount === 1) {
      const nextPuzzle = await getCipherPuzzle(currentLevel);
      eventManager.emit('alert:trigger', { alertCount: 1, level: currentLevel, agentId });

      return res.status(200).json({
        success: true,
        correct: false,
        alertCount: 1,
        level: currentLevel,
        demoted: false,
        arrested: false,
        puzzle: {
          imageUrl: nextPuzzle.imageUrl,
          hint: nextPuzzle.hint
        },
        _internalSolution: nextPuzzle.solution,
        message: 'CIPHER MISMATCH! Security Alert 1 of 3 Triggered.'
      });
    }

    // Alert 2: Strike 2 penalty - Level demoted & warning modal
    if (newAlertCount === 2) {
      const newLevel = currentLevel > 1 ? currentLevel - 1 : 1;
      const nextPuzzle = await getCipherPuzzle(newLevel);
      eventManager.emit('alert:trigger', { alertCount: 2, level: newLevel, agentId });

      return res.status(200).json({
        success: true,
        correct: false,
        alertCount: 2,
        level: newLevel,
        demoted: currentLevel > 1,
        arrested: false,
        puzzle: {
          imageUrl: nextPuzzle.imageUrl,
          hint: nextPuzzle.hint
        },
        _internalSolution: nextPuzzle.solution,
        message: 'SECURITY ALERT 2! LEVEL DEMOTED! YOU HAVE ONLY 1 CHANCE LEFT!'
      });
    }

    // Alert 3: Strike 3 - Maximum security lockdown & operative arrested
    eventManager.emit('agent:arrest', { agentId });

    return res.status(200).json({
      success: true,
      correct: false,
      alertCount: 3,
      level: currentLevel,
      demoted: false,
      arrested: true,
      message: 'SECURITY LOCKDOWN! OPERATIVE ARRESTED!'
    });

  } catch (error) {
    console.error('[GAME SUBMIT ERROR]:', error);
    return res.status(500).json({ success: false, message: 'Game engine processing error.' });
  }
}

module.exports = {
  startMission,
  submitAnswer
};
