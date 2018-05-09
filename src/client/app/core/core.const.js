/* global toastr:false */
(function () {
    'use strict';

    angular.module('app.core')
      .constant('toastr', toastr)
      .constant('groups', {
        teams: [
          { id: 1, value: 'WaterBuffaloes', label: 'Water Buffaloes', faction: 'Horde' },
          { id: 2, value: 'Mutants', label: 'Mutants', faction: 'Horde' },
          { id: 3, value: 'Goons', label: 'Goons', faction: 'Horde' },
          { id: 4, value: 'Sparkles', label: 'Sparkles', faction: 'Alliance' },
          { id: 6, value: 'ArgyleSox', label: 'Argyle Sox', faction: 'Alliance' },
          { id: 5, value: 'Flowers', label: 'Flowers', faction: 'Alliance' }
        ],
        factions: [
          { id: 2, value: 'Alliance', label: 'Alliance' },
          { id: 1, value: 'Horde', label: 'Horde' }
        ]
      });
  })();
