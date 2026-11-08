const eventManager = require('../events/eventManager');
const { pool } = require('../config/db');

// Helper: Generate very simple math puzzle based on current level
function generateEasyPuzzle(level) {
  if (level === 1) {
    // Level 1: Very easy single-digit addition (e.g. 4 + 3 = 7)
    const a = Math.floor(Math.random() * 5) + 2; // 2 to 6
    const b = Math.floor(Math.random() * 4) + 1; // 1 to 4
    return {
      question: `${a} + ${b} = ?`,
      solution: `${a + b}`,
      hint: 'Basic addition'
    };
  } else if (level === 2) {
    // Level 2: Easy subtraction (e.g. 15 - 6 = 9)
    const a = Math.floor(Math.random() * 6) + 10; // 10 to 15
    const b = Math.floor(Math.random() * 5) + 2;  // 2 to 6
    return {
      question: `${a} - ${b} = ?`,
      solution: `${a - b}`,
      hint: 'Simple subtraction'
    };
  } else {
    // Level 3: Easy small multiplication (e.g. 3 x 4 = 12)
    const a = Math.floor(Math.random() * 3) + 2; // 2 to 4
    const b = Math.floor(Math.random() * 4) + 2; // 2 to 5
    return {
      question: `${a} x ${b} = ?`,
      solution: `${a * b}`,
      hint: 'Small multiplication'
    };
  }
}

// Controller: Start a new heist infiltration mission
async function startMission(req, res) {
  const agentId = req.body.agentId || (req.agent ? req.agent.id : 9999);
  const puzzle = generateEasyPuzzle(1);

  // Event: Trigger 60-second timer countdown
  eventManager.emit('timer:start', { agentId, level: 1 });

  return res.status(200).json({
    success: true,
    level: 1,
    maxLevels: 3,
    timer: 60,
    alertCount: 0,
    puzzle: {
      question: puzzle.question,
      hint: puzzle.hint
    },
    _internalSolution: puzzle.solution
  });
}

// Controller: Submit keypad answer and evaluate events (Level up / Alerts / Demotion / Arrest)
async function submitAnswer(req, res) {
  try {
    const { answer, expectedSolution, currentLevel, alertCount, agentId } = req.body;
    const isCorrect = String(answer).trim() === String(expectedSolution).trim();

    // Event: Emit keypad button press
    eventManager.emit('keypad:press', { key: answer });

    // Scenario A: User answered correctly
    if (isCorrect) {
      if (currentLevel < 3) {
        // Advance to next level
        const nextLevel = currentLevel + 1;
        const nextPuzzle = generateEasyPuzzle(nextLevel);

        // Event: Level success
        eventManager.emit('vault:success', { level: nextLevel, vaultCracked: false, agentId });

        return res.status(200).json({
          success: true,
          correct: true,
          level: nextLevel,
          vaultCracked: false,
          alertCount: alertCount, // preserve current alert status or reset
          puzzle: {
            question: nextPuzzle.question,
            hint: nextPuzzle.hint
          },
          _internalSolution: nextPuzzle.solution,
          message: `Level ${currentLevel} cleared! Moving to Level ${nextLevel}.`
        });
      } else {
        // Level 3 Completed: Vault is Cracked!
        // Database: Update agent score in MySQL on victory
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
          message: 'ACCESS GRANTED! VAULT SUCCESSFULLY CRACKED!'
        });
      }
    }

    // Scenario B: Incorrect Answer or Timeout (Handle 3-Alert rules)
    const newAlertCount = (alertCount || 0) + 1;

    // Alert 1: First strike warning
    if (newAlertCount === 1) {
      const nextPuzzle = generateEasyPuzzle(currentLevel);
      eventManager.emit('alert:trigger', { alertCount: 1, level: currentLevel, agentId });

      return res.status(200).json({
        success: true,
        correct: false,
        alertCount: 1,
        level: currentLevel,
        demoted: false,
        arrested: false,
        puzzle: {
          question: nextPuzzle.question,
          hint: nextPuzzle.hint
        },
        _internalSolution: nextPuzzle.solution,
        message: 'INCORRECT CODE! Alert 1 of 3 Triggered.'
      });
    }

    // Alert 2: Second strike - Level Demoted (if level > 1) & popup warning
    if (newAlertCount === 2) {
      const newLevel = currentLevel > 1 ? currentLevel - 1 : 1;
      const nextPuzzle = generateEasyPuzzle(newLevel);
      eventManager.emit('alert:trigger', { alertCount: 2, level: newLevel, agentId });

      return res.status(200).json({
        success: true,
        correct: false,
        alertCount: 2,
        level: newLevel,
        demoted: currentLevel > 1,
        arrested: false,
        puzzle: {
          question: nextPuzzle.question,
          hint: nextPuzzle.hint
        },
        _internalSolution: nextPuzzle.solution,
        message: 'SECURITY ALERT 2! LEVEL DEMOTED! YOU HAVE ONLY 1 CHANCE LEFT!'
      });
    }

    // Alert 3: Third strike - Security Lockdown & Agent Arrested
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
    console.error('[GAME ERROR]:', error);
    return res.status(500).json({ success: false, message: 'Game engine error.' });
  }
}

module.exports = {
  startMission,
  submitAnswer
};

