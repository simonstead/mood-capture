var logs = [{
  "mood": "Angry",
  "intensity": "10",
  "description": "lorem",
  "timestamp": 1
},{
  "mood": "Really Really Happy",
  "intensity": "3",
  "description": "lorem",
  "timestamp": 11
},{
  "mood": "Smelly",
  "intensity": "1",
  "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "timestamp": 111
}];


$("#logTable").dynatable({
  dataset : {
    records: logs
  }
});
