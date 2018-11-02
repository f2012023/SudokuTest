var EventBus = new Vue();

const Sudoku = Vue.component('sudoku', {
  template: '<div></div>',
  data(){
    return {
      'sudoku': null
    }
  },
  mounted() {
    var self = this;
    self.sudoku = $(self.$el).sudokuJS({
      difficulty: this.difficulty,
      boardUpdatedFn: function(data) {
        console.log(data);
        self.$emit('on-updated', data);
      },
      boardFinishedFn: function(data) {
        self.$emit('on-finished', data);
      },
      boardErrorFn: function(data) {
        self.$emit('on-error', data);
      },
      candidateShowToggleFn: function(data) {
        self.$emit('on-toggle', data);
      },
    });

    EventBus.$on('start-new-game', function(difficulty){
      self.sudoku.clearBoard();
      self.sudoku.generateBoard(difficulty);
    });


    EventBus.$on('step', function(){
      self.sudoku.solveStep();
    });
  }
});

var app = new Vue({
  el: '#app',
  data() {
    return {
      finished: false,
      result: '',
      difficulty: 'easy',
    }
  },
  components: {
    'sudoku': Sudoku
  },
  methods: {
    boardUpdated: function(data){
    },
    boardFinished: function(data){
      this.finished = true;
      this.result = "You completed the game. Start over! ;)";
      this.difficulty = "";
    },
    boardError: function(data){
    },
    candidateToggle: function(data){
    },
    startGame: function(difficulty){
      this.finished = false;
      this.result = '';
      this.difficulty = difficulty;
      EventBus.$emit('start-new-game', difficulty);
    },
    step: function(){
      EventBus.$emit('step');
    }
  }
})