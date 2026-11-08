const EventEmitter = require('events');

/**
 * Event-Driven Vault Game Engine
 * Manages events for keypad input, 60s countdown timer, alerts, and vault breach.
 */
class VaultEventManager extends EventEmitter {
  constructor() {
    super();
    this.countdownDuration = 60; // 60-second timer per puzzle
    this.setupListeners();
  }

  // Event Listeners Registration
  setupListeners() {
    // Event: Keypad press detected
    this.on('keypad:press', (data) => {
      console.log(`[EVENT] Keypad Key Pressed: ${data.key} | Timestamp: ${Date.now()}`);
    });

    // Event: 60-second timer countdown started
    this.on('timer:start', (data) => {
      console.log(`[EVENT] 60s Timer Armed for Level ${data.level} | Agent: ${data.agentId || 'Guest'}`);
    });

    // Event: Security Alert triggered on wrong code or timeout
    this.on('alert:trigger', (data) => {
      console.log(`[EVENT] Security Alert ${data.alertCount}/3 Triggered! Penalty: Level ${data.level}`);
    });

    // Event: Vault level completed or cracked
    this.on('vault:success', (data) => {
      console.log(`[EVENT] Level ${data.level} Completed! Vault Status: ${data.vaultCracked ? 'CRACKED' : 'NEXT LEVEL'}`);
    });

    // Event: 3rd Alert triggered - Agent Arrested
    this.on('agent:arrest', (data) => {
      console.log(`[EVENT] Maximum Alert Reached! Agent Arrested: ${data.agentId || 'Guest'}`);
    });
  }

  // Get current status of event-driven engine
  getStatus() {
    return {
      module: 'Event-Driven Engine',
      timerDuration: this.countdownDuration,
      status: 'ACTIVE'
    };
  }
}

module.exports = new VaultEventManager();
