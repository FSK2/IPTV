// Mobile One Media Services // DevDeck Studio v2.0
// 23 Master Workspaces Repository (24 tactile keys per profile across 4 banks)

const PROFILES_DATA = {
  // 0. Dev & Creator Core (Default Master Profile)
  'creator_core': {
    name: 'Dev & Creator Core',
    category: 'dev',
    categoryTitle: 'Dev & Creator Core',
    accent: '#4cd7f6',
    layer: 'L1: DEV WORKSPACE',
    banks: [
      {
        title: 'BANK A // CLIPBOARD & EDIT INTELLIGENCE',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Undo', icon: 'undo', win: '^Z', mac: '⌘Z', action: 'undo' },
          { id: '02', label: 'Redo', icon: 'redo', win: '^Y', mac: '⌘⇧Z', action: 'redo' },
          { id: '03', label: 'Cut', icon: 'content_cut', win: '^X', mac: '⌘X', action: 'cut' },
          { id: '04', label: 'Copy', icon: 'content_copy', win: '^C', mac: '⌘C', action: 'copy' },
          { id: '05', label: 'Paste', icon: 'content_paste', win: '^V', mac: '⌘V', action: 'paste' },
          { id: '06', label: 'Select All', icon: 'select_all', win: '^A', mac: '⌘A', action: 'select all' }
        ]
      },
      {
        title: 'BANK B // CODE & DOCS FORMATTING',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Save', icon: 'save', win: '^S', mac: '⌘S', action: 'save' },
          { id: '08', label: 'Find / Rep', icon: 'search', win: '^F', mac: '⌘F', action: 'find' },
          { id: '09', label: 'Bold', icon: 'format_bold', win: '^B', mac: '⌘B', action: 'bold' },
          { id: '10', label: 'Italic', icon: 'format_italic', win: '^I', mac: '⌘I', action: 'italic' },
          { id: '11', label: 'Underline', icon: 'format_underlined', win: '^U', mac: '⌘U', action: 'underline' },
          { id: '12', label: 'Format', icon: 'code', win: '⌥⇧F', mac: '⌥⇧F', action: 'format' }
        ]
      },
      {
        title: 'BANK C // WEB & DEVELOPER FLOW',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'New Tab', icon: 'add_box', win: '^T', mac: '⌘T', action: 'new tab' },
          { id: '14', label: 'Close Tab', icon: 'close', win: '^W', mac: '⌘W', action: 'close tab' },
          { id: '15', label: 'Reopen', icon: 'history', win: '^⇧T', mac: '⌘⇧T', action: 'reopen tab' },
          { id: '16', label: 'Refresh', icon: 'refresh', win: '^R', mac: '⌘R', action: 'refresh' },
          { id: '17', label: 'History', icon: 'manage_history', win: '^H', mac: '⌘Y', action: 'history' },
          { id: '18', label: 'Dev Tools', icon: 'developer_mode', win: 'F12', mac: '⌥⌘I', action: 'devtools' }
        ]
      },
      {
        title: 'BANK D // SYSTEM PRODUCTIVITY & POWER',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Snip Tool', icon: 'crop', win: '⊞⇧S', mac: '⌘⇧4', action: 'screenshot' },
          { id: '20', label: 'Desktop', icon: 'desktop_windows', win: '⊞D', mac: 'F11', action: 'desktop' },
          { id: '21', label: 'Task Mgr', icon: 'monitoring', win: '^⇧Esc', mac: '⌥⌘Esc', action: 'task mgr' },
          { id: '22', label: 'Search', icon: 'search', win: '⊞S', mac: '⌘Space', action: 'search menu' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: '⌥F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: '⊞A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 1. Google Antigravity (AGY)
  'antigravity': {
    name: 'Google Antigravity (AGY)',
    category: 'dev',
    categoryTitle: 'AI & Developer Swarm',
    accent: '#4285F4',
    banks: [
      {
        title: 'BANK A // AGENTIC SLASH COMMANDS',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: '/goal', icon: 'rocket_launch', win: '/goal', mac: '/goal', action: '/goal' },
          { id: '02', label: '/boost', icon: 'bolt', win: '/boost', mac: '/boost', action: '/boost' },
          { id: '03', label: '/browser', icon: 'language', win: '/browser', mac: '/browser', action: '/browser' },
          { id: '04', label: '/grill-me', icon: 'forum', win: '/grill-me', mac: '/grill-me', action: '/grill-me' },
          { id: '05', label: 'Teamwork', icon: 'groups', win: '/teamwork', mac: '/teamwork', action: '/teamwork-preview' },
          { id: '06', label: '/learn', icon: 'school', win: '/learn', mac: '/learn', action: '/learn' }
        ]
      },
      {
        title: 'BANK B // AGENT DECISION & CONTROL',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Schedule', icon: 'schedule', win: '/schedule', mac: '/schedule', action: '/schedule' },
          { id: '08', label: 'Approve Plan', icon: 'check_circle', win: 'Proceed ↵', mac: 'Proceed ↵', action: 'proceed' },
          { id: '09', label: 'Request Fix', icon: 'feedback', win: 'Feedback', mac: 'Feedback', action: 'request changes' },
          { id: '10', label: 'Interrupt', icon: 'cancel', win: 'Ctrl+C', mac: '⌘C', action: 'interrupt agent' },
          { id: '11', label: 'Research Agent', icon: 'travel_explore', win: 'Research', mac: 'Research', action: 'spawn research' },
          { id: '12', label: 'Subagent Swarm', icon: 'hub', win: 'Subagent', mac: 'Subagent', action: 'spawn subagent' }
        ]
      },
      {
        title: 'BANK C // ARTIFACTS & WORKSPACE',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Plan Doc', icon: 'description', win: 'Plan.md', mac: 'Plan.md', action: 'open plan' },
          { id: '14', label: 'Walkthrough', icon: 'auto_stories', win: 'Walkthrough', mac: 'Walkthrough', action: 'open walkthrough' },
          { id: '15', label: 'View Diff', icon: 'difference', win: 'Git Diff', mac: 'Git Diff', action: 'view diff' },
          { id: '16', label: 'Run Tests', icon: 'fact_check', win: 'Test Suite', mac: 'Test Suite', action: 'run tests' },
          { id: '17', label: 'View Logs', icon: 'terminal', win: 'Transcripts', mac: 'Transcripts', action: 'view logs' },
          { id: '18', label: 'Compact Context', icon: 'cleaning_services', win: '/compact', mac: '/compact', action: 'clean scratch' }
        ]
      },
      {
        title: 'BANK D // SYSTEM & UTILITIES',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Snip Tool', icon: 'crop', win: 'Win+⇧+S', mac: '⌘⇧4', action: 'screenshot' },
          { id: '20', label: 'Terminal', icon: 'terminal', win: 'Ctrl+`', mac: '⌃`', action: 'terminal' },
          { id: '21', label: 'Task Mgr', icon: 'monitoring', win: 'Ctrl+⇧+Esc', mac: '⌥⌘Esc', action: 'task mgr' },
          { id: '22', label: 'Desktop', icon: 'desktop_windows', win: 'Win+D', mac: 'F11', action: 'desktop' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 2. Antigravity IDE
  'antigravity_ide': {
    name: 'Antigravity IDE',
    category: 'dev',
    categoryTitle: 'AI IDE & Code Engine',
    accent: '#34A853',
    banks: [
      {
        title: 'BANK A // AI PROMPT & AGENT BUS',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'AI Chat', icon: 'chat', win: 'Ctrl+⇧+L', mac: '⌘⇧L', action: 'ai chat' },
          { id: '02', label: 'Inline Prompt', icon: 'edit_note', win: 'Ctrl+K', mac: '⌘K', action: 'inline prompt' },
          { id: '03', label: 'Accept Diff', icon: 'check', win: 'Tab ⇥', mac: 'Tab ⇥', action: 'accept diff' },
          { id: '04', label: 'Reject Diff', icon: 'close', win: 'Esc', mac: 'Esc', action: 'reject diff' },
          { id: '05', label: 'Toggle Sidebar', icon: 'view_sidebar', win: 'Ctrl+B', mac: '⌘B', action: 'sidebar' },
          { id: '06', label: 'Terminal', icon: 'terminal', win: 'Ctrl+`', mac: '⌃`', action: 'terminal' }
        ]
      },
      {
        title: 'BANK B // NAVIGATION & EDIT',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Command Pal', icon: 'terminal', win: 'Ctrl+⇧+P', mac: '⌘⇧P', action: 'command palette' },
          { id: '08', label: 'Quick Open', icon: 'file_open', win: 'Ctrl+P', mac: '⌘P', action: 'quick open' },
          { id: '09', label: 'Symbol Search', icon: 'search', win: 'Ctrl+T', mac: '⌘T', action: 'symbol search' },
          { id: '10', label: 'Go Definition', icon: 'near_me', win: 'F12', mac: 'F12', action: 'definition' },
          { id: '11', label: 'Split Editor', icon: 'splitscreen', win: 'Ctrl+\\', mac: '⌘\\', action: 'split editor' },
          { id: '12', label: 'Close Editor', icon: 'close', win: 'Ctrl+W', mac: '⌘W', action: 'close tab' }
        ]
      },
      {
        title: 'BANK C // DEBUG & REFACTOR',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Format Code', icon: 'format_align_left', win: '⇧+Alt+F', mac: '⇧⌥F', action: 'format document' },
          { id: '14', label: 'Duplicate Line', icon: 'content_copy', win: '⇧+Alt+↓', mac: '⇧⌥↓', action: 'duplicate line' },
          { id: '15', label: 'Breakpoint', icon: 'fiber_manual_record', win: 'F9', mac: 'F9', action: 'toggle breakpoint' },
          { id: '16', label: 'Run Code', icon: 'play_arrow', win: 'F5', mac: 'F5', action: 'run' },
          { id: '17', label: 'Step Over', icon: 'redo', win: 'F10', mac: 'F10', action: 'step over' },
          { id: '18', label: 'Step Into', icon: 'input', win: 'F11', mac: 'F11', action: 'step into' }
        ]
      },
      {
        title: 'BANK D // SOURCE CONTROL & SYSTEM',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Git Commit', icon: 'commit', win: 'Ctrl+K', mac: '⌘K', action: 'git commit' },
          { id: '20', label: 'Git Push', icon: 'upload', win: 'Ctrl+⇧+K', mac: '⌘⇧K', action: 'git push' },
          { id: '21', label: 'Problems Pane', icon: 'error_outline', win: 'Ctrl+⇧+M', mac: '⌘⇧M', action: 'problems' },
          { id: '22', label: 'Reload Window', icon: 'refresh', win: 'Ctrl+R', mac: '⌘R', action: 'refresh' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 3. Visual Studio Code
  'vscode': {
    name: 'Visual Studio Code',
    category: 'dev',
    categoryTitle: 'IDE & Code Core',
    accent: '#007ACC',
    banks: [
      {
        title: 'BANK A // CLIPBOARD & EDIT HISTORY',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Undo', icon: 'undo', win: 'Ctrl+Z', mac: '⌘Z', action: 'undo' },
          { id: '02', label: 'Redo', icon: 'redo', win: 'Ctrl+Y', mac: '⌘⇧Z', action: 'redo' },
          { id: '03', label: 'Cut', icon: 'content_cut', win: 'Ctrl+X', mac: '⌘X', action: 'cut' },
          { id: '04', label: 'Copy', icon: 'content_copy', win: 'Ctrl+C', mac: '⌘C', action: 'copy' },
          { id: '05', label: 'Paste', icon: 'content_paste', win: 'Ctrl+V', mac: '⌘V', action: 'paste' },
          { id: '06', label: 'Select All', icon: 'select_all', win: 'Ctrl+A', mac: '⌘A', action: 'select all' }
        ]
      },
      {
        title: 'BANK B // CODE & RICH FORMATTING',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Save', icon: 'save', win: 'Ctrl+S', mac: '⌘S', action: 'save' },
          { id: '08', label: 'Find / Replace', icon: 'search', win: 'Ctrl+F', mac: '⌘F', action: 'find' },
          { id: '09', label: 'Comment Line', icon: 'comment', win: 'Ctrl+/', mac: '⌘/', action: 'comment' },
          { id: '10', label: 'Format Code', icon: 'format_align_left', win: '⇧+Alt+F', mac: '⇧⌥F', action: 'format document' },
          { id: '11', label: 'Multi Cursor', icon: 'line_style', win: 'Ctrl+Alt+↓', mac: '⌥⌘↓', action: 'multi cursor' },
          { id: '12', label: 'ENTER', icon: 'keyboard_return', win: 'Enter ↵', mac: 'Return ↵', action: 'enter' }
        ]
      },
      {
        title: 'BANK C // TABS & WORKSPACE FLOW',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'New Tab', icon: 'add_circle', win: 'Ctrl+T', mac: '⌘T', action: 'new tab' },
          { id: '14', label: 'Close Tab', icon: 'cancel', win: 'Ctrl+W', mac: '⌘W', action: 'close tab' },
          { id: '15', label: 'Reopen Tab', icon: 'restore', win: 'Ctrl+⇧+T', mac: '⌘⇧T', action: 'reopen tab' },
          { id: '16', label: 'Refresh', icon: 'refresh', win: 'F5', mac: '⌘R', action: 'refresh' },
          { id: '17', label: 'Terminal', icon: 'terminal', win: 'Ctrl+`', mac: '⌃`', action: 'terminal' },
          { id: '18', label: 'App Switch', icon: 'view_carousel', win: 'Alt+Tab', mac: '⌘Tab', action: 'app switch' }
        ]
      },
      {
        title: 'BANK D // SYSTEM PRIVILEGES & POWER',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Snip Tool', icon: 'crop', win: 'Win+⇧+S', mac: '⌘⇧4', action: 'snip tool' },
          { id: '20', label: 'Desktop', icon: 'desktop_windows', win: 'Win+D', mac: 'F11', action: 'desktop' },
          { id: '21', label: 'Task Mgr', icon: 'monitoring', win: 'Ctrl+⇧+Esc', mac: '⌥⌘Esc', action: 'task mgr' },
          { id: '22', label: 'Print', icon: 'print', win: 'Ctrl+P', mac: '⌘P', action: 'print' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 4. GitHub Copilot
  'copilot': {
    name: 'GitHub Copilot',
    category: 'dev',
    categoryTitle: 'AI Code Generation',
    accent: '#6E40C9',
    banks: [
      {
        title: 'BANK A // COPILOT SUGGEST & PROMPTS',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Copilot Chat', icon: 'smart_toy', win: 'Ctrl+Alt+I', mac: '⌃⌥I', action: 'copilot chat' },
          { id: '02', label: 'Inline Suggest', icon: 'lightbulb', win: 'Alt+\\', mac: '⌥\\', action: 'copilot suggest' },
          { id: '03', label: 'Next Suggestion', icon: 'arrow_forward', win: 'Alt+]', mac: '⌥]', action: 'next suggestion' },
          { id: '04', label: 'Prev Suggestion', icon: 'arrow_back', win: 'Alt+[', mac: '⌥[', action: 'prev suggestion' },
          { id: '05', label: 'Accept Word', icon: 'check', win: 'Ctrl+→', mac: '⌘→', action: 'accept word' },
          { id: '06', label: 'Explain Code', icon: 'help_outline', win: 'Explain', mac: 'Explain', action: 'explain code' }
        ]
      },
      {
        title: 'BANK B // AUTOMATED GENERATORS',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Generate Tests', icon: 'fact_check', win: 'Unit Tests', mac: 'Unit Tests', action: 'generate tests' },
          { id: '08', label: 'Fix Bugs', icon: 'bug_report', win: 'Fix /bug', mac: 'Fix /bug', action: 'fix bugs' },
          { id: '09', label: 'Docstring Gen', icon: 'notes', win: 'Docs', mac: 'Docs', action: 'generate docs' },
          { id: '10', label: 'Scaffold API', icon: 'api', win: 'API Route', mac: 'API Route', action: 'scaffold api' },
          { id: '11', label: 'Refactor Code', icon: 'auto_fix_normal', win: 'Refactor', mac: 'Refactor', action: 'refactor code' },
          { id: '12', label: 'Add Logging', icon: 'receipt_long', win: 'Logger', mac: 'Logger', action: 'add logging' }
        ]
      },
      {
        title: 'BANK C // IDE ACTIONS',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Command Pal', icon: 'terminal', win: 'Ctrl+⇧+P', mac: '⌘⇧P', action: 'command palette' },
          { id: '14', label: 'Quick Open', icon: 'file_open', win: 'Ctrl+P', mac: '⌘P', action: 'quick open' },
          { id: '15', label: 'Terminal', icon: 'terminal', win: 'Ctrl+`', mac: '⌃`', action: 'terminal' },
          { id: '16', label: 'Format Doc', icon: 'format_align_left', win: '⇧+Alt+F', mac: '⇧⌥F', action: 'format document' },
          { id: '17', label: 'Find / Replace', icon: 'search', win: 'Ctrl+F', mac: '⌘F', action: 'find' },
          { id: '18', label: 'Save', icon: 'save', win: 'Ctrl+S', mac: '⌘S', action: 'save' }
        ]
      },
      {
        title: 'BANK D // SYSTEM CONTROL',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Undo', icon: 'undo', win: 'Ctrl+Z', mac: '⌘Z', action: 'undo' },
          { id: '20', label: 'Redo', icon: 'redo', win: 'Ctrl+Y', mac: '⌘⇧Z', action: 'redo' },
          { id: '21', label: 'Snip Tool', icon: 'crop', win: 'Win+⇧+S', mac: '⌘⇧4', action: 'snip tool' },
          { id: '22', label: 'Task Mgr', icon: 'monitoring', win: 'Ctrl+⇧+Esc', mac: '⌥⌘Esc', action: 'task mgr' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 5. IntelliJ IDEA
  'intellij': {
    name: 'IntelliJ IDEA',
    category: 'dev',
    categoryTitle: 'Java & Polyglot IDE',
    accent: '#FE315D',
    banks: [
      {
        title: 'BANK A // REFACTOR & COMPLETION',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Search All', icon: 'search', win: '⇧ ⇧', mac: '⇧ ⇧', action: 'search everywhere' },
          { id: '02', label: 'Quick Fix', icon: 'lightbulb', win: 'Alt+↵', mac: '⌥↵', action: 'show intention' },
          { id: '03', label: 'Rename', icon: 'drive_file_rename_outline', win: '⇧+F6', mac: '⇧F6', action: 'rename symbol' },
          { id: '04', label: 'Reformat', icon: 'format_align_left', win: 'Ctrl+Alt+L', mac: '⌥⌘L', action: 'reformat code' },
          { id: '05', label: 'Optimize Imp', icon: 'auto_fix_high', win: 'Ctrl+Alt+O', mac: '⌃⌥O', action: 'optimize imports' },
          { id: '06', label: 'Generate', icon: 'build', win: 'Alt+Ins', mac: '⌘N', action: 'generate code' }
        ]
      },
      {
        title: 'BANK B // BUILD & DEBUG',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Run App', icon: 'play_arrow', win: '⇧+F10', mac: '⌃R', action: 'run' },
          { id: '08', label: 'Debug', icon: 'bug_report', win: '⇧+F9', mac: '⌃D', action: 'debug' },
          { id: '09', label: 'Step Over', icon: 'redo', win: 'F8', mac: 'F8', action: 'step over' },
          { id: '10', label: 'Step Into', icon: 'input', win: 'F7', mac: 'F7', action: 'step into' },
          { id: '11', label: 'Resume Prog', icon: 'play_circle', win: 'F9', mac: '⌥⌘R', action: 'resume' },
          { id: '12', label: 'Stop Runner', icon: 'stop', win: 'Ctrl+F2', mac: '⌘F2', action: 'stop' }
        ]
      },
      {
        title: 'BANK C // NAVIGATION & VCS',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Find In Files', icon: 'find_in_page', win: 'Ctrl+⇧+F', mac: '⌘⇧F', action: 'find in files' },
          { id: '14', label: 'Recent Files', icon: 'history', win: 'Ctrl+E', mac: '⌘E', action: 'recent files' },
          { id: '15', label: 'Implementation', icon: 'near_me', win: 'Ctrl+Alt+B', mac: '⌥⌘B', action: 'go implementation' },
          { id: '16', label: 'Git Commit', icon: 'commit', win: 'Ctrl+K', mac: '⌘K', action: 'git commit' },
          { id: '17', label: 'Git Push', icon: 'upload', win: 'Ctrl+⇧+K', mac: '⌘⇧K', action: 'git push' },
          { id: '18', label: 'Terminal', icon: 'terminal', win: 'Alt+F12', mac: '⌥F12', action: 'terminal' }
        ]
      },
      {
        title: 'BANK D // SYSTEM CONTROL',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Undo', icon: 'undo', win: 'Ctrl+Z', mac: '⌘Z', action: 'undo' },
          { id: '20', label: 'Redo', icon: 'redo', win: 'Ctrl+⇧+Z', mac: '⌘⇧Z', action: 'redo' },
          { id: '21', label: 'Snip Tool', icon: 'crop', win: 'Win+⇧+S', mac: '⌘⇧4', action: 'snip tool' },
          { id: '22', label: 'Task Mgr', icon: 'monitoring', win: 'Ctrl+⇧+Esc', mac: '⌥⌘Esc', action: 'task mgr' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 6. Claude Code CLI
  'claude_code': {
    name: 'Claude Code CLI',
    category: 'dev',
    categoryTitle: 'Agentic CLI Assistant',
    accent: '#D97706',
    banks: [
      {
        title: 'BANK A // AGENT DISPATCH & FLAGS',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Auto Yes (-y)', icon: 'check_circle', win: 'claude -y', mac: 'claude -y', action: 'claude -y' },
          { id: '02', label: 'Compact Context', icon: 'cleaning_services', win: '/compact', mac: '/compact', action: '/compact' },
          { id: '03', label: 'Clear Memory', icon: 'delete_sweep', win: '/clear', mac: '/clear', action: '/clear' },
          { id: '04', label: 'Token Cost', icon: 'paid', win: '/cost', mac: '/cost', action: '/cost' },
          { id: '05', label: 'Config Menu', icon: 'settings', win: '/config', mac: '/config', action: '/config' },
          { id: '06', label: 'Doctor Diagnostics', icon: 'medical_services', win: '/doctor', mac: '/doctor', action: '/doctor' }
        ]
      },
      {
        title: 'BANK B // ENGINEERING PIPELINE',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Review PR Diff', icon: 'rate_review', win: 'Review PR', mac: 'Review PR', action: 'review diff' },
          { id: '08', label: 'Security Audit', icon: 'security', win: 'Audit', mac: 'Audit', action: 'security scan' },
          { id: '09', label: 'Write Unit Tests', icon: 'fact_check', win: 'Tests', mac: 'Tests', action: 'write tests' },
          { id: '10', label: 'Scaffold Service', icon: 'architecture', win: 'Scaffold', mac: 'Scaffold', action: 'scaffold service' },
          { id: '11', label: 'Fix Runtime Bug', icon: 'bug_report', win: 'Fix Bug', mac: 'Fix Bug', action: 'fix bug' },
          { id: '12', label: 'Summarize PR', icon: 'summarize', win: 'PR Summary', mac: 'PR Summary', action: 'summarize pr' }
        ]
      },
      {
        title: 'BANK C // TERMINAL CONTROL',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Interrupt (SIGINT)', icon: 'cancel', win: 'Ctrl+C', mac: '⌃C', action: 'interrupt agent' },
          { id: '14', label: 'Paste Buffer', icon: 'content_paste', win: 'Ctrl+V', mac: '⌘V', action: 'paste' },
          { id: '15', label: 'Toggle Shell', icon: 'terminal', win: 'Ctrl+`', mac: '⌃`', action: 'terminal' },
          { id: '16', label: 'Scroll Buffer Up', icon: 'arrow_upward', win: 'Shift+PgUp', mac: '⇧PgUp', action: 'scroll up' },
          { id: '17', label: 'Scroll Buffer Dn', icon: 'arrow_downward', win: 'Shift+PgDn', mac: '⇧PgDn', action: 'scroll down' },
          { id: '18', label: 'Claude Help', icon: 'help_outline', win: '/help', mac: '/help', action: '/help' }
        ]
      },
      {
        title: 'BANK D // SYSTEM CONTROL',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Snip Tool', icon: 'crop', win: 'Win+⇧+S', mac: '⌘⇧4', action: 'snip tool' },
          { id: '20', label: 'Desktop', icon: 'desktop_windows', win: 'Win+D', mac: 'F11', action: 'desktop' },
          { id: '21', label: 'Task Mgr', icon: 'monitoring', win: 'Ctrl+⇧+Esc', mac: '⌥⌘Esc', action: 'task mgr' },
          { id: '22', label: 'Copy All', icon: 'content_copy', win: 'Ctrl+A Ctrl+C', mac: '⌘A ⌘C', action: 'copy all' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 7. OpenAI Codex & GPT
  'codex': {
    name: 'OpenAI Codex & GPT',
    category: 'dev',
    categoryTitle: 'AI Code & Prompt Engine',
    accent: '#10A37F',
    banks: [
      {
        title: 'BANK A // PROMPT GENERATION',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Gen Boilerplate', icon: 'auto_fix_high', win: 'Generate', mac: 'Generate', action: 'generate boilerplate' },
          { id: '02', label: 'Inline Complete', icon: 'bolt', win: 'Complete', mac: 'Complete', action: 'inline complete' },
          { id: '03', label: 'Explain Logic', icon: 'psychology', win: 'Explain', mac: 'Explain', action: 'explain logic' },
          { id: '04', label: 'Fix Syntax', icon: 'build_circle', win: 'Fix Syntax', mac: 'Fix Syntax', action: 'fix syntax' },
          { id: '05', label: 'Translate Lang', icon: 'translate', win: 'Translate', mac: 'Translate', action: 'translate code' },
          { id: '06', label: 'Docstrings', icon: 'notes', win: 'Docstrings', mac: 'Docstrings', action: 'add docstrings' }
        ]
      },
      {
        title: 'BANK B // ADVANCED CODE OPS',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Optimize SQL', icon: 'database', win: 'SQL Optimize', mac: 'SQL Optimize', action: 'optimize sql' },
          { id: '08', label: 'Scaffold API', icon: 'api', win: 'Scaffold API', mac: 'Scaffold API', action: 'scaffold api' },
          { id: '09', label: 'Regex Builder', icon: 'regular_expression', win: 'Regex Gen', mac: 'Regex Gen', action: 'regex builder' },
          { id: '10', label: 'Unit Test Matrix', icon: 'fact_check', win: 'Test Matrix', mac: 'Test Matrix', action: 'test matrix' },
          { id: '11', label: 'Mock Data Gen', icon: 'schema', win: 'Mock Data', mac: 'Mock Data', action: 'mock data' },
          { id: '12', label: 'Shell Command', icon: 'terminal', win: 'Bash Gen', mac: 'Bash Gen', action: 'bash gen' }
        ]
      },
      {
        title: 'BANK C // DIFF & RE-PROMPT',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Accept Output', icon: 'check', win: 'Tab ⇥', mac: 'Tab ⇥', action: 'accept output' },
          { id: '14', label: 'Reject Output', icon: 'close', win: 'Esc', mac: 'Esc', action: 'reject output' },
          { id: '15', label: 'Copy Snippet', icon: 'content_copy', win: 'Ctrl+C', mac: '⌘C', action: 'copy' },
          { id: '16', label: 'Re-prompt', icon: 'refresh', win: 'Retry', mac: 'Retry', action: 'retry prompt' },
          { id: '17', label: 'Clear Input', icon: 'delete', win: 'Clear', mac: 'Clear', action: 'clear input' },
          { id: '18', label: 'Run Sandbox', icon: 'play_arrow', win: 'Ctrl+↵', mac: '⌘↵', action: 'run sandbox' }
        ]
      },
      {
        title: 'BANK D // SYSTEM CONTROL',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Undo', icon: 'undo', win: 'Ctrl+Z', mac: '⌘Z', action: 'undo' },
          { id: '20', label: 'Redo', icon: 'redo', win: 'Ctrl+Y', mac: '⌘⇧Z', action: 'redo' },
          { id: '21', label: 'Terminal', icon: 'terminal', win: 'Ctrl+`', mac: '⌃`', action: 'terminal' },
          { id: '22', label: 'Task Mgr', icon: 'monitoring', win: 'Ctrl+⇧+Esc', mac: '⌥⌘Esc', action: 'task mgr' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 8. Adobe Premiere Pro
  'premiere': {
    name: 'Adobe Premiere Pro',
    category: 'video',
    categoryTitle: 'Video Timeline & NLE',
    accent: '#9999FF',
    banks: [
      {
        title: 'BANK A // CUTTING & TOOLS',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Select (V)', icon: 'near_me', win: 'V', mac: 'V', action: 'selection tool' },
          { id: '02', label: 'Blade Razor', icon: 'content_cut', win: 'C', mac: 'C', action: 'blade' },
          { id: '03', label: 'Ripple Edit', icon: 'sync_alt', win: 'B', mac: 'B', action: 'ripple edit' },
          { id: '04', label: 'Ripple Delete', icon: 'backspace', win: '⇧+Del', mac: '⇧Del', action: 'ripple delete' },
          { id: '05', label: 'Mark In', icon: 'first_page', win: 'I', mac: 'I', action: 'mark in' },
          { id: '06', label: 'Mark Out', icon: 'last_page', win: 'O', mac: 'O', action: 'mark out' }
        ]
      },
      {
        title: 'BANK B // TIMELINE & EDITING',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Insert Edit', icon: 'arrow_downward', win: ',', mac: ',', action: 'insert clip' },
          { id: '08', label: 'Overwrite', icon: 'file_download', win: '.', mac: '.', action: 'overwrite clip' },
          { id: '09', label: 'Render In-Out', icon: 'motion_photos_on', win: 'Enter ↵', mac: 'Return ↵', action: 'render in to out' },
          { id: '10', label: 'Export Media', icon: 'movie', win: 'Ctrl+M', mac: '⌘M', action: 'export media' },
          { id: '11', label: 'Speed/Duration', icon: 'speed', win: 'Ctrl+R', mac: '⌘R', action: 'speed' },
          { id: '12', label: 'Add Edit', icon: 'vertical_split', win: 'Ctrl+K', mac: '⌘K', action: 'add edit' }
        ]
      },
      {
        title: 'BANK C // PLAYBACK & NAVIGATION',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Play / Pause', icon: 'play_arrow', win: 'Space', mac: 'Space', action: 'play/pause' },
          { id: '14', label: 'Prev Edit', icon: 'skip_previous', win: 'Up ↑', mac: 'Up ↑', action: 'prev edit' },
          { id: '15', label: 'Next Edit', icon: 'skip_next', win: 'Down ↓', mac: 'Down ↓', action: 'next edit' },
          { id: '16', label: 'Zoom In', icon: 'zoom_in', win: '=', mac: '=', action: 'zoom in timeline' },
          { id: '17', label: 'Zoom Out', icon: 'zoom_out', win: '-', mac: '-', action: 'zoom out timeline' },
          { id: '18', label: 'Snapping', icon: 'magnet', win: 'S', mac: 'S', action: 'snapping' }
        ]
      },
      {
        title: 'BANK D // SYSTEM CONTROL',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Undo', icon: 'undo', win: 'Ctrl+Z', mac: '⌘Z', action: 'undo' },
          { id: '20', label: 'Redo', icon: 'redo', win: 'Ctrl+⇧+Z', mac: '⌘⇧Z', action: 'redo' },
          { id: '21', label: 'Save Project', icon: 'save', win: 'Ctrl+S', mac: '⌘S', action: 'save' },
          { id: '22', label: 'Task Mgr', icon: 'monitoring', win: 'Ctrl+⇧+Esc', mac: '⌥⌘Esc', action: 'task mgr' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 9. Adobe After Effects
  'aftereffects': {
    name: 'Adobe After Effects',
    category: 'video',
    categoryTitle: 'Motion Graphics & VFX',
    accent: '#9999FF',
    banks: [
      {
        title: 'BANK A // TOOLS & KEYFRAMES',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Selection (V)', icon: 'near_me', win: 'V', mac: 'V', action: 'selection tool' },
          { id: '02', label: 'Pen Tool (G)', icon: 'edit', win: 'G', mac: 'G', action: 'pen tool' },
          { id: '03', label: 'Hand Tool (H)', icon: 'pan_tool', win: 'H', mac: 'H', action: 'hand tool' },
          { id: '04', label: 'Text Tool', icon: 'title', win: 'Ctrl+T', mac: '⌘T', action: 'text tool' },
          { id: '05', label: 'Easy Ease', icon: 'auto_awesome', win: 'F9', mac: 'F9', action: 'easy ease' },
          { id: '06', label: 'Graph Editor', icon: 'ssid_chart', win: '⇧+F3', mac: '⇧F3', action: 'graph editor' }
        ]
      },
      {
        title: 'BANK B // COMPOSITION & LAYERS',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'RAM Preview', icon: 'play_circle', win: 'Num 0', mac: 'Num 0', action: 'ram preview' },
          { id: '08', label: 'Trim Comp Area', icon: 'crop', win: 'Ctrl+⇧+X', mac: '⌘⇧X', action: 'trim comp' },
          { id: '09', label: 'Split Layer', icon: 'vertical_split', win: 'Ctrl+⇧+D', mac: '⌘⇧D', action: 'split layer' },
          { id: '10', label: 'Duplicate Layer', icon: 'content_copy', win: 'Ctrl+D', mac: '⌘D', action: 'duplicate layer' },
          { id: '11', label: 'Pre-compose', icon: 'layers', win: 'Ctrl+⇧+C', mac: '⌘⇧C', action: 'precompose' },
          { id: '12', label: 'Render Queue', icon: 'movie', win: 'Ctrl+M', mac: '⌘M', action: 'render queue' }
        ]
      },
      {
        title: 'BANK C // TRANSFORM PROPERTIES',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Position (P)', icon: 'open_with', win: 'P', mac: 'P', action: 'position prop' },
          { id: '14', label: 'Scale (S)', icon: 'aspect_ratio', win: 'S', mac: 'S', action: 'scale prop' },
          { id: '15', label: 'Rotation (R)', icon: 'rotate_right', win: 'R', mac: 'R', action: 'rotation prop' },
          { id: '16', label: 'Opacity (T)', icon: 'opacity', win: 'T', mac: 'T', action: 'opacity prop' },
          { id: '17', label: 'Effect Control', icon: 'tune', win: 'F3', mac: 'F3', action: 'effect controls' },
          { id: '18', label: 'Time Reverse', icon: 'fast_rewind', win: 'Ctrl+Alt+R', mac: '⌥⌘R', action: 'time reverse' }
        ]
      },
      {
        title: 'BANK D // SYSTEM CONTROL',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Undo', icon: 'undo', win: 'Ctrl+Z', mac: '⌘Z', action: 'undo' },
          { id: '20', label: 'Redo', icon: 'redo', win: 'Ctrl+⇧+Z', mac: '⌘⇧Z', action: 'redo' },
          { id: '21', label: 'Save Project', icon: 'save', win: 'Ctrl+S', mac: '⌘S', action: 'save' },
          { id: '22', label: 'Snip Tool', icon: 'crop', win: 'Win+⇧+S', mac: '⌘⇧4', action: 'snip tool' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 10. DaVinci Resolve
  'davinci': {
    name: 'DaVinci Resolve',
    category: 'video',
    categoryTitle: 'Color Grading & NLE',
    accent: '#E74C3C',
    banks: [
      {
        title: 'BANK A // EDITING MODES',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Normal Edit (A)', icon: 'near_me', win: 'A', mac: 'A', action: 'normal edit' },
          { id: '02', label: 'Trim Edit (T)', icon: 'content_cut', win: 'T', mac: 'T', action: 'trim edit' },
          { id: '03', label: 'Blade Edit (B)', icon: 'vertical_align_center', win: 'B', mac: 'B', action: 'blade' },
          { id: '04', label: 'Ripple Cut', icon: 'backspace', win: 'Ctrl+⇧+X', mac: '⌘⇧X', action: 'ripple cut' },
          { id: '05', label: 'Mark In', icon: 'first_page', win: 'I', mac: 'I', action: 'mark in' },
          { id: '06', label: 'Mark Out', icon: 'last_page', win: 'O', mac: 'O', action: 'mark out' }
        ]
      },
      {
        title: 'BANK B // TIMELINE INSERT & COLOR',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Append to End', icon: 'playlist_add', win: '⇧+F12', mac: '⇧F12', action: 'append timeline' },
          { id: '08', label: 'Overwrite (F10)', icon: 'file_download', win: 'F10', mac: 'F10', action: 'overwrite' },
          { id: '09', label: 'Insert (F9)', icon: 'arrow_downward', win: 'F9', mac: 'F9', action: 'insert' },
          { id: '10', label: 'Add Serial Node', icon: 'alt_route', win: 'Alt+S', mac: '⌥S', action: 'serial node' },
          { id: '11', label: 'Auto Color', icon: 'auto_fix_high', win: 'Alt+A', mac: '⌥A', action: 'auto color' },
          { id: '12', label: 'Quick Export', icon: 'movie', win: 'Quick Exp', mac: 'Quick Exp', action: 'quick export' }
        ]
      },
      {
        title: 'BANK C // PLAYBACK & VIEW',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Play / Pause', icon: 'play_arrow', win: 'Space', mac: 'Space', action: 'play/pause' },
          { id: '14', label: 'Forward (L)', icon: 'fast_forward', win: 'L', mac: 'L', action: 'play forward' },
          { id: '15', label: 'Reverse (J)', icon: 'fast_rewind', win: 'J', mac: 'J', action: 'play reverse' },
          { id: '16', label: 'Zoom To Fit', icon: 'fit_screen', win: '⇧+Z', mac: '⇧Z', action: 'zoom fit' },
          { id: '17', label: 'Snapping (N)', icon: 'magnet', win: 'N', mac: 'N', action: 'snapping' },
          { id: '18', label: 'Full Screen', icon: 'fullscreen', win: 'Ctrl+F', mac: '⌘F', action: 'full screen' }
        ]
      },
      {
        title: 'BANK D // SYSTEM CONTROL',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Undo', icon: 'undo', win: 'Ctrl+Z', mac: '⌘Z', action: 'undo' },
          { id: '20', label: 'Redo', icon: 'redo', win: 'Ctrl+⇧+Z', mac: '⌘⇧Z', action: 'redo' },
          { id: '21', label: 'Save Project', icon: 'save', win: 'Ctrl+S', mac: '⌘S', action: 'save' },
          { id: '22', label: 'Task Mgr', icon: 'monitoring', win: 'Ctrl+⇧+Esc', mac: '⌥⌘Esc', action: 'task mgr' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 11. Blender 3D & Animation
  'blender': {
    name: 'Blender 3D',
    category: 'video',
    categoryTitle: '3D Modeling, VFX & CGI Suite',
    accent: '#EA7600',
    banks: [
      {
        title: 'BANK A // MESH & MODELING',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Edit/Object', icon: 'sync', win: 'Tab', mac: 'Tab', action: 'edit/object mode' },
          { id: '02', label: 'Extrude (E)', icon: 'open_in_full', win: 'E', mac: 'E', action: 'extrude' },
          { id: '03', label: 'Inset (I)', icon: 'crop_free', win: 'I', mac: 'I', action: 'inset face' },
          { id: '04', label: 'Bevel', icon: 'rounded_corner', win: 'Ctrl+B', mac: 'Ctrl+B', action: 'bevel edge' },
          { id: '05', label: 'Loop Cut', icon: 'horizontal_split', win: 'Ctrl+R', mac: 'Ctrl+R', action: 'loop cut' },
          { id: '06', label: 'Add Mesh', icon: 'add_circle', win: '⇧+A', mac: '⇧+A', action: 'add mesh' }
        ]
      },
      {
        title: 'BANK B // TRANSFORM & CAMERA',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Move / Grab', icon: 'pan_tool', win: 'G', mac: 'G', action: 'grab' },
          { id: '08', label: 'Rotate (R)', icon: 'refresh', win: 'R', mac: 'R', action: 'rotate' },
          { id: '09', label: 'Scale (S)', icon: 'aspect_ratio', win: 'S', mac: 'S', action: 'scale' },
          { id: '10', label: 'Camera View', icon: 'videocam', win: 'Num 0', mac: 'Num 0', action: 'camera view' },
          { id: '11', label: 'Duplicate', icon: 'content_copy', win: '⇧+D', mac: '⇧+D', action: 'duplicate' },
          { id: '12', label: 'Delete Face', icon: 'delete', win: 'X', mac: 'X', action: 'delete' }
        ]
      },
      {
        title: 'BANK C // RENDER & SHADING',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Render Image', icon: 'photo_camera', win: 'F12', mac: 'F12', action: 'render image' },
          { id: '14', label: 'Render Anim', icon: 'movie_filter', win: 'Ctrl+F12', mac: 'Ctrl+F12', action: 'render animation' },
          { id: '15', label: 'Shading Pie', icon: 'palette', win: 'Z', mac: 'Z', action: 'shading pie' },
          { id: '16', label: 'Focus Object', icon: 'filter_center_focus', win: 'Num .', mac: 'Num .', action: 'focus selected' },
          { id: '17', label: 'Hide Selected', icon: 'visibility_off', win: 'H', mac: 'H', action: 'hide' },
          { id: '18', label: 'Unhide All', icon: 'visibility', win: 'Alt+H', mac: 'Alt+H', action: 'unhide all' }
        ]
      },
      {
        title: 'BANK D // SYSTEM CONTROL',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Undo', icon: 'undo', win: 'Ctrl+Z', mac: 'Ctrl+Z', action: 'undo' },
          { id: '20', label: 'Redo', icon: 'redo', win: 'Ctrl+⇧+Z', mac: 'Ctrl+⇧+Z', action: 'redo' },
          { id: '21', label: 'Save Project', icon: 'save', win: 'Ctrl+S', mac: 'Ctrl+S', action: 'save' },
          { id: '22', label: 'Snip Tool', icon: 'crop', win: 'Win+⇧+S', mac: 'Win+⇧+S', action: 'snip tool' },
          { id: '23', label: 'Task Mgr', icon: 'monitoring', win: 'Ctrl+⇧+Esc', mac: 'Ctrl+⇧+Esc', action: 'task mgr' },
          { id: '24', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: 'Alt+F4', action: 'force kill', danger: true }
        ]
      }
    ]
  },

  // 12. OBS Studio
  'obs': {
    name: 'OBS Studio',
    category: 'video',
    categoryTitle: 'Live Streaming & Broadcast',
    accent: '#302E31',
    banks: [
      {
        title: 'BANK A // BROADCAST TRANSPORT',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Start Stream', icon: 'podcasts', win: 'Ctrl+F1', mac: '⌃F1', action: 'obs start stream' },
          { id: '02', label: 'Stop Stream', icon: 'stop_circle', win: 'Ctrl+F2', mac: '⌃F2', action: 'obs stop stream' },
          { id: '03', label: 'Start Record', icon: 'fiber_manual_record', win: 'Ctrl+F3', mac: '⌃F3', action: 'obs record' },
          { id: '04', label: 'Stop Record', icon: 'stop', win: 'Ctrl+F4', mac: '⌃F4', action: 'obs stop record' },
          { id: '05', label: 'Pause Record', icon: 'pause', win: 'Ctrl+F5', mac: '⌃F5', action: 'obs pause record' },
          { id: '06', label: 'Studio Mode', icon: 'splitscreen', win: 'Ctrl+F6', mac: '⌃F6', action: 'obs studio mode' }
        ]
      },
      {
        title: 'BANK B // SCENE SWITCHER',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Scene 1: Main', icon: 'desktop_windows', win: 'Ctrl+1', mac: '⌘1', action: 'scene 1' },
          { id: '08', label: 'Scene 2: Screen', icon: 'screenshot_monitor', win: 'Ctrl+2', mac: '⌘2', action: 'scene 2' },
          { id: '09', label: 'Scene 3: Cam', icon: 'videocam', win: 'Ctrl+3', mac: '⌘3', action: 'scene 3' },
          { id: '10', label: 'Scene 4: BRB', icon: 'hourglass_empty', win: 'Ctrl+4', mac: '⌘4', action: 'scene 4' },
          { id: '11', label: 'Scene 5: End', icon: 'cancel', win: 'Ctrl+5', mac: '⌘5', action: 'scene 5' },
          { id: '12', label: 'Transition', icon: 'transform', win: 'Space', mac: 'Space', action: 'obs transition' }
        ]
      },
      {
        title: 'BANK C // AUDIO & UTILITY',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Mute Desktop', icon: 'volume_off', win: 'Alt+F1', mac: '⌥F1', action: 'mute desktop' },
          { id: '14', label: 'Mute Mic', icon: 'mic_off', win: 'Alt+F2', mac: '⌥F2', action: 'mute mic' },
          { id: '15', label: 'Virtual Cam', icon: 'camera_alt', win: 'Alt+F3', mac: '⌥F3', action: 'toggle virtual cam' },
          { id: '16', label: 'Replay Buffer', icon: 'replay', win: 'Alt+F4', mac: '⌥F4', action: 'save replay buffer' },
          { id: '17', label: 'Screenshot', icon: 'crop', win: 'Alt+F5', mac: '⌥F5', action: 'obs screenshot' },
          { id: '18', label: 'Audio Monitor', icon: 'headphones', win: 'Alt+F6', mac: '⌥F6', action: 'audio monitor' }
        ]
      },
      {
        title: 'BANK D // SYSTEM CONTROL',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Desktop', icon: 'desktop_windows', win: 'Win+D', mac: 'F11', action: 'desktop' },
          { id: '20', label: 'Task Mgr', icon: 'monitoring', win: 'Ctrl+⇧+Esc', mac: '⌥⌘Esc', action: 'task mgr' },
          { id: '21', label: 'App Switch', icon: 'view_carousel', win: 'Alt+Tab', mac: '⌘Tab', action: 'app switch' },
          { id: '22', label: 'Snip Tool', icon: 'crop', win: 'Win+⇧+S', mac: '⌘⇧4', action: 'snip tool' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 13. Figma
  'figma': {
    name: 'Figma',
    category: 'design',
    categoryTitle: 'UI/UX & Vector Canvas',
    accent: '#F24E1E',
    banks: [
      {
        title: 'BANK A // CANVAS & VECTOR TOOLS',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Frame Tool', icon: 'grid_view', win: 'F', mac: 'F', action: 'frame tool' },
          { id: '02', label: 'Rectangle', icon: 'crop_square', win: 'R', mac: 'R', action: 'rectangle' },
          { id: '03', label: 'Text Tool', icon: 'title', win: 'T', mac: 'T', action: 'text tool' },
          { id: '04', label: 'Auto Layout', icon: 'view_agenda', win: '⇧+A', mac: '⇧A', action: 'auto layout' },
          { id: '05', label: 'Remove Auto', icon: 'dashboard_customize', win: 'Alt+⇧+A', mac: '⌥⇧A', action: 'remove auto layout' },
          { id: '06', label: 'Component', icon: 'widgets', win: 'Ctrl+Alt+K', mac: '⌥⌘K', action: 'create component' }
        ]
      },
      {
        title: 'BANK B // SELECTION & GROUPING',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Detach Instance', icon: 'link_off', win: 'Ctrl+Alt+B', mac: '⌥⌘B', action: 'detach instance' },
          { id: '08', label: 'Zoom Fit', icon: 'fit_screen', win: '⇧+1', mac: '⇧1', action: 'zoom fit' },
          { id: '09', label: 'Zoom Selection', icon: 'filter_center_focus', win: '⇧+2', mac: '⇧2', action: 'zoom selection' },
          { id: '10', label: 'Show/Hide UI', icon: 'visibility', win: 'Ctrl+\\', mac: '⌘\\', action: 'show hide ui' },
          { id: '11', label: 'Copy SVG', icon: 'code', win: 'Ctrl+⇧+C', mac: '⌘⇧C', action: 'copy svg' },
          { id: '12', label: 'Group', icon: 'layers', win: 'Ctrl+G', mac: '⌘G', action: 'group' }
        ]
      },
      {
        title: 'BANK C // ALIGNMENT & CLIPBOARD',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Ungroup', icon: 'layers_clear', win: 'Ctrl+⇧+G', mac: '⌘⇧G', action: 'ungroup' },
          { id: '14', label: 'Eyedropper', icon: 'colorize', win: 'I', mac: 'I', action: 'eyedropper' },
          { id: '15', label: 'Align Left', icon: 'align_horizontal_left', win: 'Alt+A', mac: '⌥A', action: 'align left' },
          { id: '16', label: 'Align Center', icon: 'align_horizontal_center', win: 'Alt+H', mac: '⌥H', action: 'align center' },
          { id: '17', label: 'Align Right', icon: 'align_horizontal_right', win: 'Alt+D', mac: '⌥D', action: 'align right' },
          { id: '18', label: 'Export Asset', icon: 'file_download', win: 'Ctrl+⇧+E', mac: '⌘⇧E', action: 'export asset' }
        ]
      },
      {
        title: 'BANK D // SYSTEM CONTROL',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Undo', icon: 'undo', win: 'Ctrl+Z', mac: '⌘Z', action: 'undo' },
          { id: '20', label: 'Redo', icon: 'redo', win: 'Ctrl+Y', mac: '⌘⇧Z', action: 'redo' },
          { id: '21', label: 'Duplicate', icon: 'content_copy', win: 'Ctrl+D', mac: '⌘D', action: 'duplicate' },
          { id: '22', label: 'Task Mgr', icon: 'monitoring', win: 'Ctrl+⇧+Esc', mac: '⌥⌘Esc', action: 'task mgr' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 14. Adobe Photoshop
  'photoshop': {
    name: 'Adobe Photoshop',
    category: 'design',
    categoryTitle: 'Raster & Image Manipulation',
    accent: '#31A8FF',
    banks: [
      {
        title: 'BANK A // ESSENTIAL TOOLS',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Move Tool (V)', icon: 'open_with', win: 'V', mac: 'V', action: 'move tool' },
          { id: '02', label: 'Marquee (M)', icon: 'select', win: 'M', mac: 'M', action: 'marquee' },
          { id: '03', label: 'Brush Tool (B)', icon: 'brush', win: 'B', mac: 'B', action: 'brush tool' },
          { id: '04', label: 'Eraser (E)', icon: 'ink_eraser', win: 'E', mac: 'E', action: 'eraser' },
          { id: '05', label: 'Quick Select (W)', icon: 'auto_fix_high', win: 'W', mac: 'W', action: 'quick select' },
          { id: '06', label: 'Crop Tool (C)', icon: 'crop', win: 'C', mac: 'C', action: 'crop tool' }
        ]
      },
      {
        title: 'BANK B // SELECTIONS & LAYERS',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Free Transform', icon: 'transform', win: 'Ctrl+T', mac: '⌘T', action: 'free transform' },
          { id: '08', label: 'Select Subject', icon: 'person_search', win: 'Select Sub', mac: 'Select Sub', action: 'select subject' },
          { id: '09', label: 'Invert Select', icon: 'invert_colors', win: 'Ctrl+⇧+I', mac: '⌘⇧I', action: 'invert selection' },
          { id: '10', label: 'Deselect', icon: 'deselect', win: 'Ctrl+D', mac: '⌘D', action: 'deselect' },
          { id: '11', label: 'New Layer', icon: 'add_box', win: 'Ctrl+⇧+N', mac: '⌘⇧N', action: 'new layer' },
          { id: '12', label: 'Merge Layers', icon: 'layers', win: 'Ctrl+E', mac: '⌘E', action: 'merge layers' }
        ]
      },
      {
        title: 'BANK C // ADJUSTMENTS & BRUSHES',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Levels', icon: 'tune', win: 'Ctrl+L', mac: '⌘L', action: 'levels' },
          { id: '14', label: 'Curves', icon: 'show_chart', win: 'Ctrl+M', mac: '⌘M', action: 'curves' },
          { id: '15', label: 'Hue / Saturation', icon: 'palette', win: 'Ctrl+U', mac: '⌘U', action: 'hue saturation' },
          { id: '16', label: 'Brush Size +', icon: 'add', win: ']', mac: ']', action: 'brush bigger' },
          { id: '17', label: 'Brush Size -', icon: 'remove', win: '[', mac: '[', action: 'brush smaller' },
          { id: '18', label: 'Eyedropper (I)', icon: 'colorize', win: 'I', mac: 'I', action: 'eyedropper' }
        ]
      },
      {
        title: 'BANK D // SYSTEM CONTROL',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Undo', icon: 'undo', win: 'Ctrl+Z', mac: '⌘Z', action: 'undo' },
          { id: '20', label: 'Redo', icon: 'redo', win: 'Ctrl+⇧+Z', mac: '⌘⇧Z', action: 'redo' },
          { id: '21', label: 'Save As', icon: 'save', win: 'Ctrl+⇧+S', mac: '⌘⇧S', action: 'save as' },
          { id: '22', label: 'Task Mgr', icon: 'monitoring', win: 'Ctrl+⇧+Esc', mac: '⌥⌘Esc', action: 'task mgr' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 15. Adobe Illustrator
  'illustrator': {
    name: 'Adobe Illustrator',
    category: 'design',
    categoryTitle: 'Vector Graphics & Illustration',
    accent: '#FF9A00',
    banks: [
      {
        title: 'BANK A // VECTOR TOOLS',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Select (V)', icon: 'near_me', win: 'V', mac: 'V', action: 'selection tool' },
          { id: '02', label: 'Direct Select (A)', icon: 'navigation', win: 'A', mac: 'A', action: 'direct select' },
          { id: '03', label: 'Pen Tool (P)', icon: 'draw', win: 'P', mac: 'P', action: 'pen tool' },
          { id: '04', label: 'Shape Builder', icon: 'shapes', win: '⇧+M', mac: '⇧M', action: 'shape builder' },
          { id: '05', label: 'Type Tool (T)', icon: 'title', win: 'T', mac: 'T', action: 'type tool' },
          { id: '06', label: 'Eyedropper (I)', icon: 'colorize', win: 'I', mac: 'I', action: 'eyedropper' }
        ]
      },
      {
        title: 'BANK B // PATHS & MASKS',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Group', icon: 'folder', win: 'Ctrl+G', mac: '⌘G', action: 'group' },
          { id: '08', label: 'Ungroup', icon: 'folder_open', win: 'Ctrl+⇧+G', mac: '⌘⇧G', action: 'ungroup' },
          { id: '09', label: 'Clipping Mask', icon: 'content_cut', win: 'Ctrl+7', mac: '⌘7', action: 'clipping mask' },
          { id: '10', label: 'Release Mask', icon: 'undo', win: 'Ctrl+Alt+7', mac: '⌥⌘7', action: 'release mask' },
          { id: '11', label: 'Outline Stroke', icon: 'line_weight', win: 'Ctrl+⇧+O', mac: '⌘⇧O', action: 'outline stroke' },
          { id: '12', label: 'Pathfinder Unite', icon: 'join', win: 'Unite', mac: 'Unite', action: 'pathfinder unite' }
        ]
      },
      {
        title: 'BANK C // ALIGNMENT & CANVAS',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Align Center', icon: 'align_horizontal_center', win: 'Alt+H', mac: '⌥H', action: 'align center' },
          { id: '14', label: 'Align Top', icon: 'align_vertical_top', win: 'Alt+V', mac: '⌥V', action: 'align top' },
          { id: '15', label: 'Fit In Window', icon: 'fit_screen', win: 'Ctrl+0', mac: '⌘0', action: 'fit window' },
          { id: '16', label: 'Rulers Toggle', icon: 'straighten', win: 'Ctrl+R', mac: '⌘R', action: 'rulers' },
          { id: '17', label: 'Grids Toggle', icon: 'grid_on', win: "Ctrl+'", mac: "⌘'", action: 'grids' },
          { id: '18', label: 'Export Screen', icon: 'file_download', win: 'Ctrl+Alt+E', mac: '⌥⌘E', action: 'export screens' }
        ]
      },
      {
        title: 'BANK D // SYSTEM CONTROL',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Undo', icon: 'undo', win: 'Ctrl+Z', mac: '⌘Z', action: 'undo' },
          { id: '20', label: 'Redo', icon: 'redo', win: 'Ctrl+⇧+Z', mac: '⌘⇧Z', action: 'redo' },
          { id: '21', label: 'Duplicate', icon: 'content_copy', win: 'Ctrl+D', mac: '⌘D', action: 'duplicate' },
          { id: '22', label: 'Task Mgr', icon: 'monitoring', win: 'Ctrl+⇧+Esc', mac: '⌥⌘Esc', action: 'task mgr' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 16. Adobe Lightroom
  'lightroom': {
    name: 'Adobe Lightroom',
    category: 'design',
    categoryTitle: 'Photo Curation & RAW Grading',
    accent: '#31A8FF',
    banks: [
      {
        title: 'BANK A // MODULES & RATINGS',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Develop Mod (D)', icon: 'tune', win: 'D', mac: 'D', action: 'develop module' },
          { id: '02', label: 'Library Mod (G)', icon: 'grid_view', win: 'G', mac: 'G', action: 'library module' },
          { id: '03', label: 'Pick Flag (P)', icon: 'flag', win: 'P', mac: 'P', action: 'pick flag' },
          { id: '04', label: 'Reject Photo (X)', icon: 'close', win: 'X', mac: 'X', action: 'reject photo' },
          { id: '05', label: '5-Star Rating', icon: 'star', win: '5', mac: '5', action: 'rate 5' },
          { id: '06', label: 'Unrate (0)', icon: 'star_outline', win: '0', mac: '0', action: 'rate 0' }
        ]
      },
      {
        title: 'BANK B // AUTO ENHANCE & PRESETS',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Auto Tone', icon: 'auto_fix_high', win: 'Ctrl+U', mac: '⌘U', action: 'auto tone' },
          { id: '08', label: 'Auto White Bal', icon: 'wb_auto', win: 'Ctrl+⇧+U', mac: '⌘⇧U', action: 'auto wb' },
          { id: '09', label: 'Copy Settings', icon: 'content_copy', win: 'Ctrl+⇧+C', mac: '⌘⇧C', action: 'copy settings' },
          { id: '10', label: 'Paste Settings', icon: 'content_paste', win: 'Ctrl+⇧+V', mac: '⌘⇧V', action: 'paste settings' },
          { id: '11', label: 'Sync Settings', icon: 'sync', win: 'Ctrl+Alt+S', mac: '⌥⌘S', action: 'sync settings' },
          { id: '12', label: 'Export Photos', icon: 'file_download', win: 'Ctrl+⇧+E', mac: '⌘⇧E', action: 'export photos' }
        ]
      },
      {
        title: 'BANK C // TOOLS & COMPARISONS',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Before / After', icon: 'compare', win: '\\', mac: '\\', action: 'before after' },
          { id: '14', label: 'Crop Tool (R)', icon: 'crop', win: 'R', mac: 'R', action: 'crop tool' },
          { id: '15', label: 'Spot Removal', icon: 'healing', win: 'Q', mac: 'Q', action: 'spot removal' },
          { id: '16', label: 'Radial Filter', icon: 'blur_circular', win: '⇧+M', mac: '⇧M', action: 'radial filter' },
          { id: '17', label: 'Graduated Filter', icon: 'gradient', win: 'M', mac: 'M', action: 'graduated filter' },
          { id: '18', label: 'Full Screen (F)', icon: 'fullscreen', win: 'F', mac: 'F', action: 'fullscreen' }
        ]
      },
      {
        title: 'BANK D // SYSTEM CONTROL',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Undo', icon: 'undo', win: 'Ctrl+Z', mac: '⌘Z', action: 'undo' },
          { id: '20', label: 'Redo', icon: 'redo', win: 'Ctrl+Y', mac: '⌘⇧Z', action: 'redo' },
          { id: '21', label: 'Desktop', icon: 'desktop_windows', win: 'Win+D', mac: 'F11', action: 'desktop' },
          { id: '22', label: 'Task Mgr', icon: 'monitoring', win: 'Ctrl+⇧+Esc', mac: '⌥⌘Esc', action: 'task mgr' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 17. Notion
  'notion': {
    name: 'Notion',
    category: 'office',
    categoryTitle: 'Knowledge Base & Workspace',
    accent: '#FFFFFF',
    banks: [
      {
        title: 'BANK A // NAVIGATION & PAGES',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Quick Search', icon: 'search', win: 'Ctrl+P', mac: '⌘P', action: 'quick find' },
          { id: '02', label: 'New Page', icon: 'add_circle', win: 'Ctrl+N', mac: '⌘N', action: 'new page' },
          { id: '03', label: 'New Window', icon: 'open_in_new', win: 'Ctrl+⇧+N', mac: '⌘⇧N', action: 'new window' },
          { id: '04', label: 'Toggle Sidebar', icon: 'view_sidebar', win: 'Ctrl+\\', mac: '⌘\\', action: 'sidebar' },
          { id: '05', label: 'Go Back', icon: 'arrow_back', win: 'Ctrl+[', mac: '⌘[', action: 'go back' },
          { id: '06', label: 'Go Forward', icon: 'arrow_forward', win: 'Ctrl+]', mac: '⌘]', action: 'go forward' }
        ]
      },
      {
        title: 'BANK B // BLOCKS & HEADINGS',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Heading 1', icon: 'format_h1', win: 'Ctrl+Alt+1', mac: '⌥⌘1', action: 'heading 1' },
          { id: '08', label: 'Heading 2', icon: 'format_h2', win: 'Ctrl+Alt+2', mac: '⌥⌘2', action: 'heading 2' },
          { id: '09', label: 'Heading 3', icon: 'format_h3', win: 'Ctrl+Alt+3', mac: '⌥⌘3', action: 'heading 3' },
          { id: '10', label: 'To-Do Checkbox', icon: 'check_box', win: 'Ctrl+Alt+4', mac: '⌥⌘4', action: 'todo list' },
          { id: '11', label: 'Bullet List', icon: 'format_list_bulleted', win: 'Ctrl+Alt+5', mac: '⌥⌘5', action: 'bullet list' },
          { id: '12', label: 'Toggle List', icon: 'expand_more', win: 'Ctrl+Alt+7', mac: '⌥⌘7', action: 'toggle list' }
        ]
      },
      {
        title: 'BANK C // RICH STYLES & BLOCKS',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Code Block', icon: 'code', win: 'Ctrl+Alt+8', mac: '⌥⌘8', action: 'code block' },
          { id: '14', label: 'Bold Text', icon: 'format_bold', win: 'Ctrl+B', mac: '⌘B', action: 'bold' },
          { id: '15', label: 'Italic Text', icon: 'format_italic', win: 'Ctrl+I', mac: '⌘I', action: 'italic' },
          { id: '16', label: 'Copy Block Link', icon: 'link', win: 'Ctrl+L', mac: '⌘L', action: 'copy link' },
          { id: '17', label: 'Duplicate Block', icon: 'content_copy', win: 'Ctrl+D', mac: '⌘D', action: 'duplicate' },
          { id: '18', label: 'Comment Block', icon: 'add_comment', win: 'Ctrl+⇧+M', mac: '⌘⇧M', action: 'comment' }
        ]
      },
      {
        title: 'BANK D // SYSTEM CONTROL',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Undo', icon: 'undo', win: 'Ctrl+Z', mac: '⌘Z', action: 'undo' },
          { id: '20', label: 'Redo', icon: 'redo', win: 'Ctrl+Y', mac: '⌘⇧Z', action: 'redo' },
          { id: '21', label: 'Snip Tool', icon: 'crop', win: 'Win+⇧+S', mac: '⌘⇧4', action: 'snip tool' },
          { id: '22', label: 'Task Mgr', icon: 'monitoring', win: 'Ctrl+⇧+Esc', mac: '⌥⌘Esc', action: 'task mgr' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 18. Slack
  'slack': {
    name: 'Slack',
    category: 'office',
    categoryTitle: 'Team Communication & Channels',
    accent: '#4A154B',
    banks: [
      {
        title: 'BANK A // QUICK SWITCH & INBOX',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Quick Switcher', icon: 'flash_on', win: 'Ctrl+K', mac: '⌘K', action: 'quick switcher' },
          { id: '02', label: 'Search All', icon: 'search', win: 'Ctrl+G', mac: '⌘G', action: 'search' },
          { id: '03', label: 'Direct Messages', icon: 'forum', win: 'Ctrl+⇧+K', mac: '⌘⇧K', action: 'dms' },
          { id: '04', label: 'Activity/Mentions', icon: 'alternate_email', win: 'Ctrl+⇧+M', mac: '⌘⇧M', action: 'mentions' },
          { id: '05', label: 'Mark All Read', icon: 'done_all', win: '⇧+Esc', mac: '⇧Esc', action: 'mark all read' },
          { id: '06', label: 'All Unreads', icon: 'mark_chat_unread', win: 'Ctrl+⇧+A', mac: '⌘⇧A', action: 'unreads' }
        ]
      },
      {
        title: 'BANK B // CHAT & HUDDLE',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'New Message', icon: 'edit_square', win: 'Ctrl+N', mac: '⌘N', action: 'new message' },
          { id: '08', label: 'Toggle Canvas', icon: 'article', win: 'Ctrl+⇧+E', mac: '⌘⇧E', action: 'toggle canvas' },
          { id: '09', label: 'Toggle Huddle', icon: 'headphones', win: 'Ctrl+⇧+H', mac: '⌘⇧H', action: 'toggle huddle' },
          { id: '10', label: 'Emoji Reaction', icon: 'mood', win: 'Ctrl+⇧+\\', mac: '⌘⇧\\', action: 'emoji react' },
          { id: '11', label: 'Code Block', icon: 'code', win: 'Ctrl+Alt+⇧+C', mac: '⌥⌘⇧C', action: 'code block' },
          { id: '12', label: 'Bullet List', icon: 'format_list_bulleted', win: 'Ctrl+⇧+8', mac: '⌘⇧8', action: 'bullet list' }
        ]
      },
      {
        title: 'BANK C // NAVIGATION & UTILITY',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Copy Link', icon: 'link', win: 'Ctrl+C', mac: '⌘C', action: 'copy' },
          { id: '14', label: 'Paste Text', icon: 'content_paste', win: 'Ctrl+V', mac: '⌘V', action: 'paste' },
          { id: '15', label: 'Next Channel', icon: 'arrow_downward', win: 'Alt+↓', mac: '⌥↓', action: 'next channel' },
          { id: '16', label: 'Prev Channel', icon: 'arrow_upward', win: 'Alt+↑', mac: '⌥↑', action: 'prev channel' },
          { id: '17', label: 'Mute Channel', icon: 'notifications_off', win: 'Mute', mac: 'Mute', action: 'mute channel' },
          { id: '18', label: 'Zoom In', icon: 'zoom_in', win: 'Ctrl+=', mac: '⌘=', action: 'zoom in' }
        ]
      },
      {
        title: 'BANK D // SYSTEM CONTROL',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Snip Tool', icon: 'crop', win: 'Win+⇧+S', mac: '⌘⇧4', action: 'snip tool' },
          { id: '20', label: 'Task Mgr', icon: 'monitoring', win: 'Ctrl+⇧+Esc', mac: '⌥⌘Esc', action: 'task mgr' },
          { id: '21', label: 'Desktop', icon: 'desktop_windows', win: 'Win+D', mac: 'F11', action: 'desktop' },
          { id: '22', label: 'Reload Slack', icon: 'refresh', win: 'Ctrl+R', mac: '⌘R', action: 'refresh' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 19. Zoom Conference
  'zoom': {
    name: 'Zoom Conference',
    category: 'office',
    categoryTitle: 'Video Meetings & Live Audio',
    accent: '#2D8CFF',
    banks: [
      {
        title: 'BANK A // MEETING CONTROLS',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Mute / Unmute', icon: 'mic_off', win: 'Alt+A', mac: '⌘⇧A', action: 'zoom mute' },
          { id: '02', label: 'Video On/Off', icon: 'videocam', win: 'Alt+V', mac: '⌘⇧V', action: 'zoom video' },
          { id: '03', label: 'Share Screen', icon: 'screen_share', win: 'Alt+S', mac: '⌘⇧S', action: 'share screen' },
          { id: '04', label: 'Pause Share', icon: 'pause_presentation', win: 'Alt+T', mac: '⌘⇧T', action: 'pause share' },
          { id: '05', label: 'Raise Hand', icon: 'front_hand', win: 'Alt+Y', mac: '⌥Y', action: 'raise hand' },
          { id: '06', label: 'Meeting Chat', icon: 'chat', win: 'Alt+H', mac: '⌘⇧H', action: 'meeting chat' }
        ]
      },
      {
        title: 'BANK B // PARTICIPANTS & RECORD',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Invite Guests', icon: 'person_add', win: 'Alt+I', mac: '⌘I', action: 'invite' },
          { id: '08', label: 'Record Meeting', icon: 'fiber_manual_record', win: 'Alt+R', mac: '⌘⇧R', action: 'record meeting' },
          { id: '09', label: 'Switch View', icon: 'view_agenda', win: 'Alt+F1', mac: '⌘⇧W', action: 'switch view' },
          { id: '10', label: 'End Meeting', icon: 'call_end', win: 'Alt+Q', mac: '⌘W', action: 'end meeting' },
          { id: '11', label: 'Volume Up', icon: 'volume_up', win: 'Vol+', mac: 'Vol+', action: 'volume up' },
          { id: '12', label: 'Volume Down', icon: 'volume_down', win: 'Vol-', mac: 'Vol-', action: 'volume down' }
        ]
      },
      {
        title: 'BANK C // SCREEN & APPS',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Full Screen', icon: 'fullscreen', win: 'Alt+F', mac: '⌘⇧F', action: 'full screen' },
          { id: '14', label: 'Gallery View', icon: 'grid_view', win: 'Alt+F2', mac: '⌘⇧W', action: 'gallery view' },
          { id: '15', label: 'Speaker View', icon: 'person', win: 'Alt+F1', mac: '⌘⇧W', action: 'speaker view' },
          { id: '16', label: 'Screen Snip', icon: 'crop', win: 'Win+⇧+S', mac: '⌘⇧4', action: 'snip tool' },
          { id: '17', label: 'Copy Link', icon: 'link', win: 'Ctrl+C', mac: '⌘C', action: 'copy' },
          { id: '18', label: 'Paste Text', icon: 'content_paste', win: 'Ctrl+V', mac: '⌘V', action: 'paste' }
        ]
      },
      {
        title: 'BANK D // SYSTEM CONTROL',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Undo', icon: 'undo', win: 'Ctrl+Z', mac: '⌘Z', action: 'undo' },
          { id: '20', label: 'Desktop', icon: 'desktop_windows', win: 'Win+D', mac: 'F11', action: 'desktop' },
          { id: '21', label: 'Task Mgr', icon: 'monitoring', win: 'Ctrl+⇧+Esc', mac: '⌥⌘Esc', action: 'task mgr' },
          { id: '22', label: 'Mute Sound', icon: 'volume_mute', win: 'Mute', mac: 'Mute', action: 'mute' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 20. Microsoft Teams
  'teams': {
    name: 'Microsoft Teams',
    category: 'office',
    categoryTitle: 'Collaboration & Video Calling',
    accent: '#6264A7',
    banks: [
      {
        title: 'BANK A // MEETING & AUDIO',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Mute / Unmute', icon: 'mic_off', win: 'Ctrl+⇧+M', mac: '⌘⇧M', action: 'teams mute' },
          { id: '02', label: 'Camera On/Off', icon: 'videocam', win: 'Ctrl+⇧+O', mac: '⌘⇧O', action: 'teams camera' },
          { id: '03', label: 'Share Screen', icon: 'screen_share', win: 'Ctrl+⇧+E', mac: '⌘⇧E', action: 'teams share' },
          { id: '04', label: 'Raise Hand', icon: 'front_hand', win: 'Ctrl+⇧+K', mac: '⌘⇧K', action: 'teams hand' },
          { id: '05', label: 'Open Chat', icon: 'chat', win: 'Ctrl+2', mac: '⌘2', action: 'open chat' },
          { id: '06', label: 'Activity Feed', icon: 'notifications', win: 'Ctrl+1', mac: '⌘1', action: 'activity feed' }
        ]
      },
      {
        title: 'BANK B // CHAT & CALL OPS',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Filter Feed', icon: 'filter_list', win: 'Ctrl+⇧+F', mac: '⌘⇧F', action: 'filter' },
          { id: '08', label: 'Search All', icon: 'search', win: 'Ctrl+E', mac: '⌘E', action: 'search' },
          { id: '09', label: 'New Chat', icon: 'edit_square', win: 'Ctrl+N', mac: '⌘N', action: 'new chat' },
          { id: '10', label: 'Accept Call', icon: 'call', win: 'Ctrl+⇧+S', mac: '⌘⇧S', action: 'accept call' },
          { id: '11', label: 'Decline Call', icon: 'call_end', win: 'Ctrl+⇧+D', mac: '⌘⇧D', action: 'decline call' },
          { id: '12', label: 'Record Meeting', icon: 'fiber_manual_record', win: 'Record', mac: 'Record', action: 'record call' }
        ]
      },
      {
        title: 'BANK C // AUDIO & SCREEN',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Mute Audio', icon: 'volume_mute', win: 'Mute', mac: 'Mute', action: 'mute' },
          { id: '14', label: 'Volume Up', icon: 'volume_up', win: 'Vol+', mac: 'Vol+', action: 'volume up' },
          { id: '15', label: 'Volume Down', icon: 'volume_down', win: 'Vol-', mac: 'Vol-', action: 'volume down' },
          { id: '16', label: 'Snip Tool', icon: 'crop', win: 'Win+⇧+S', mac: '⌘⇧4', action: 'snip tool' },
          { id: '17', label: 'Copy Link', icon: 'link', win: 'Ctrl+C', mac: '⌘C', action: 'copy' },
          { id: '18', label: 'Paste Text', icon: 'content_paste', win: 'Ctrl+V', mac: '⌘V', action: 'paste' }
        ]
      },
      {
        title: 'BANK D // SYSTEM CONTROL',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Desktop', icon: 'desktop_windows', win: 'Win+D', mac: 'F11', action: 'desktop' },
          { id: '20', label: 'Task Mgr', icon: 'monitoring', win: 'Ctrl+⇧+Esc', mac: '⌥⌘Esc', action: 'task mgr' },
          { id: '21', label: 'App Switch', icon: 'view_carousel', win: 'Alt+Tab', mac: '⌘Tab', action: 'app switch' },
          { id: '22', label: 'Full Screen', icon: 'fullscreen', win: 'F11', mac: '⌃⌘F', action: 'fullscreen' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 21. Microsoft Excel
  'excel': {
    name: 'Microsoft Excel',
    category: 'office',
    categoryTitle: 'Spreadsheet & Data Analysis',
    accent: '#107C41',
    banks: [
      {
        title: 'BANK A // FORMULAS & NUMBERS',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'AutoSum', icon: 'functions', win: 'Alt+=', mac: '⌘⇧T', action: 'autosum' },
          { id: '02', label: 'Currency $', icon: 'attach_money', win: 'Ctrl+⇧+$', mac: '⌃⇧$', action: 'currency format' },
          { id: '03', label: 'Percent %', icon: 'percent', win: 'Ctrl+⇧+%', mac: '⌃⇧%', action: 'percent format' },
          { id: '04', label: 'Insert Date', icon: 'calendar_today', win: 'Ctrl+;', mac: '⌘;', action: 'insert date' },
          { id: '05', label: 'Insert Time', icon: 'schedule', win: 'Ctrl+⇧+;', mac: '⌘⇧;', action: 'insert time' },
          { id: '06', label: 'Flash Fill', icon: 'bolt', win: 'Ctrl+E', mac: '⌃E', action: 'flash fill' }
        ]
      },
      {
        title: 'BANK B // ROWS, COLS & TABLES',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Filter Toggle', icon: 'filter_alt', win: 'Ctrl+⇧+L', mac: '⌘⇧F', action: 'filter toggle' },
          { id: '08', label: 'Create Table', icon: 'table_chart', win: 'Ctrl+T', mac: '⌘T', action: 'create table' },
          { id: '09', label: 'Insert Row/Col', icon: 'add_circle', win: 'Ctrl++', mac: '⌃⇧+', action: 'insert row' },
          { id: '10', label: 'Delete Row/Col', icon: 'remove_circle', win: 'Ctrl+-', mac: '⌃-', action: 'delete row' },
          { id: '11', label: 'Hide Row', icon: 'visibility_off', win: 'Ctrl+9', mac: '⌃9', action: 'hide row' },
          { id: '12', label: 'Hide Column', icon: 'visibility_off', win: 'Ctrl+0', mac: '⌃0', action: 'hide col' }
        ]
      },
      {
        title: 'BANK C // NAVIGATION & EDIT',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Find', icon: 'search', win: 'Ctrl+F', mac: '⌘F', action: 'find' },
          { id: '14', label: 'Replace', icon: 'find_replace', win: 'Ctrl+H', mac: '⌃H', action: 'replace' },
          { id: '15', label: 'Select Column', icon: 'view_column', win: 'Ctrl+Space', mac: '⌃Space', action: 'select col' },
          { id: '16', label: 'Select Row', icon: 'view_agenda', win: '⇧+Space', mac: '⇧Space', action: 'select row' },
          { id: '17', label: 'Edit Cell (F2)', icon: 'edit', win: 'F2', mac: '⌃U', action: 'edit cell' },
          { id: '18', label: 'Calculate F9', icon: 'calculate', win: 'F9', mac: 'F9', action: 'calculate' }
        ]
      },
      {
        title: 'BANK D // SYSTEM CONTROL',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Undo', icon: 'undo', win: 'Ctrl+Z', mac: '⌘Z', action: 'undo' },
          { id: '20', label: 'Redo', icon: 'redo', win: 'Ctrl+Y', mac: '⌘⇧Z', action: 'redo' },
          { id: '21', label: 'Save Sheet', icon: 'save', win: 'Ctrl+S', mac: '⌘S', action: 'save' },
          { id: '22', label: 'Print', icon: 'print', win: 'Ctrl+P', mac: '⌘P', action: 'print' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 22. Microsoft PowerPoint
  'powerpoint': {
    name: 'Microsoft PowerPoint',
    category: 'office',
    categoryTitle: 'Presentations & Slides',
    accent: '#C43E1C',
    banks: [
      {
        title: 'BANK A // SLIDESHOW CONTROLS',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Start Show (F5)', icon: 'play_arrow', win: 'F5', mac: '⌘⇧↵', action: 'start presentation' },
          { id: '02', label: 'Current Slide', icon: 'slideshow', win: '⇧+F5', mac: '⌘↵', action: 'from current slide' },
          { id: '03', label: 'End Show (Esc)', icon: 'stop', win: 'Esc', mac: 'Esc', action: 'end show' },
          { id: '04', label: 'Next Slide', icon: 'arrow_forward', win: 'PgDn', mac: 'Space', action: 'next slide' },
          { id: '05', label: 'Prev Slide', icon: 'arrow_back', win: 'PgUp', mac: 'Del', action: 'prev slide' },
          { id: '06', label: 'Black Screen', icon: 'contrast', win: 'B', mac: 'B', action: 'black screen' }
        ]
      },
      {
        title: 'BANK B // ANNOTATE & SLIDES',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Laser Pointer', icon: 'highlight', win: 'Ctrl+L', mac: '⌘L', action: 'laser pointer' },
          { id: '08', label: 'Pen Tool', icon: 'edit', win: 'Ctrl+P', mac: '⌘P', action: 'pen tool' },
          { id: '09', label: 'Eraser', icon: 'ink_eraser', win: 'Ctrl+E', mac: '⌘E', action: 'eraser' },
          { id: '10', label: 'White Screen', icon: 'wb_sunny', win: 'W', mac: 'W', action: 'white screen' },
          { id: '11', label: 'Duplicate Slide', icon: 'content_copy', win: 'Ctrl+D', mac: '⌘D', action: 'duplicate slide' },
          { id: '12', label: 'New Slide', icon: 'add_box', win: 'Ctrl+M', mac: '⌘⇧N', action: 'new slide' }
        ]
      },
      {
        title: 'BANK C // SHAPES & FORMATTING',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Group Shapes', icon: 'layers', win: 'Ctrl+G', mac: '⌥⌘G', action: 'group' },
          { id: '14', label: 'Ungroup', icon: 'layers_clear', win: 'Ctrl+⇧+G', mac: '⌥⌘⇧G', action: 'ungroup' },
          { id: '15', label: 'Bring Forward', icon: 'flip_to_front', win: 'Ctrl+⇧+]', mac: '⌥⌘]', action: 'bring forward' },
          { id: '16', label: 'Send Back', icon: 'flip_to_back', win: 'Ctrl+⇧+[', mac: '⌥⌘[', action: 'send back' },
          { id: '17', label: 'Align Center', icon: 'align_horizontal_center', win: 'Alt+H', mac: '⌥H', action: 'align center' },
          { id: '18', label: 'Save Deck', icon: 'save', win: 'Ctrl+S', mac: '⌘S', action: 'save' }
        ]
      },
      {
        title: 'BANK D // SYSTEM CONTROL',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Undo', icon: 'undo', win: 'Ctrl+Z', mac: '⌘Z', action: 'undo' },
          { id: '20', label: 'Redo', icon: 'redo', win: 'Ctrl+Y', mac: '⌘⇧Z', action: 'redo' },
          { id: '21', label: 'Snip Tool', icon: 'crop', win: 'Win+⇧+S', mac: '⌘⇧4', action: 'snip tool' },
          { id: '22', label: 'Task Mgr', icon: 'monitoring', win: 'Ctrl+⇧+Esc', mac: '⌥⌘Esc', action: 'task mgr' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  },

  // 23. Spotify
  'spotify': {
    name: 'Spotify',
    category: 'media',
    categoryTitle: 'Music & Audio Playback',
    accent: '#1DB954',
    banks: [
      {
        title: 'BANK A // TRANSPORT & VOLUME',
        count: '6 ACTIONS',
        color: 'primary',
        keys: [
          { id: '01', label: 'Play / Pause', icon: 'play_arrow', win: 'Space', mac: 'Space', action: 'play/pause' },
          { id: '02', label: 'Next Track', icon: 'skip_next', win: 'Ctrl+→', mac: '⌘→', action: 'next track' },
          { id: '03', label: 'Prev Track', icon: 'skip_previous', win: 'Ctrl+←', mac: '⌘←', action: 'prev track' },
          { id: '04', label: 'Volume Up', icon: 'volume_up', win: 'Ctrl+↑', mac: '⌘↑', action: 'volume up' },
          { id: '05', label: 'Volume Down', icon: 'volume_down', win: 'Ctrl+↓', mac: '⌘↓', action: 'volume down' },
          { id: '06', label: 'Mute Audio', icon: 'volume_mute', win: 'Mute', mac: 'Mute', action: 'mute' }
        ]
      },
      {
        title: 'BANK B // PLAYLISTS & DISCOVERY',
        count: '6 ACTIONS',
        color: 'tertiary',
        keys: [
          { id: '07', label: 'Like Track', icon: 'favorite', win: 'Alt+⇧+B', mac: '⌥⇧B', action: 'like track' },
          { id: '08', label: 'Shuffle', icon: 'shuffle', win: 'Ctrl+S', mac: '⌘S', action: 'shuffle' },
          { id: '09', label: 'Repeat', icon: 'repeat', win: 'Ctrl+R', mac: '⌘R', action: 'repeat' },
          { id: '10', label: 'Search Music', icon: 'search', win: 'Ctrl+L', mac: '⌘L', action: 'search spotify' },
          { id: '11', label: 'Queue', icon: 'queue_music', win: 'Queue', mac: 'Queue', action: 'queue' },
          { id: '12', label: 'Lyrics', icon: 'mic', win: 'Lyrics', mac: 'Lyrics', action: 'lyrics' }
        ]
      },
      {
        title: 'BANK C // AUDIO CONTROL',
        count: '6 ACTIONS',
        color: 'secondary',
        keys: [
          { id: '13', label: 'Seek +5s', icon: 'forward_5', win: '⇧+→', mac: '⇧→', action: 'seek forward' },
          { id: '14', label: 'Seek -5s', icon: 'replay_5', win: '⇧+←', mac: '⇧←', action: 'seek back' },
          { id: '15', label: 'New Playlist', icon: 'playlist_add', win: 'Ctrl+N', mac: '⌘N', action: 'new playlist' },
          { id: '16', label: 'Copy Link', icon: 'link', win: 'Ctrl+C', mac: '⌘C', action: 'copy' },
          { id: '17', label: 'Vol 100%', icon: 'volume_up', win: 'Max Vol', mac: 'Max Vol', action: 'volume up' },
          { id: '18', label: 'Vol 50%', icon: 'volume_down', win: 'Half Vol', mac: 'Half Vol', action: 'volume down' }
        ]
      },
      {
        title: 'BANK D // SYSTEM CONTROL',
        count: '6 ACTIONS',
        color: 'error',
        keys: [
          { id: '19', label: 'Desktop', icon: 'desktop_windows', win: 'Win+D', mac: 'F11', action: 'desktop' },
          { id: '20', label: 'Snip Tool', icon: 'crop', win: 'Win+⇧+S', mac: '⌘⇧4', action: 'snip tool' },
          { id: '21', label: 'Task Mgr', icon: 'monitoring', win: 'Ctrl+⇧+Esc', mac: '⌥⌘Esc', action: 'task mgr' },
          { id: '22', label: 'App Switch', icon: 'view_carousel', win: 'Alt+Tab', mac: '⌘Tab', action: 'app switch' },
          { id: '23', label: 'Force Kill', icon: 'dangerous', win: 'Alt+F4', mac: '⌘Q', action: 'force kill', danger: true },
          { id: '24', label: 'Settings', icon: 'tune', win: 'Win+A', mac: '⌘,', action: 'settings menu' }
        ]
      }
    ]
  }
};
