var FlapBuffer = function(wrap, num_lines) {
    this.wrap = wrap;
    this.num_lines = num_lines;
    this.line_buffer = '';
    this.buffers = [[]];
    this.cursor = 0;
};

FlapBuffer.prototype = {

    pushLine: function(line) {

        if (this.buffers[this.cursor].length < this.num_lines) {
           this.buffers[this.cursor].push(line);
        } else {
            this.buffers.push([]);
            this.cursor++;
            this.pushLine(line);
        } 
    },

    pushWord: function(word) {
        if (this.line_buffer.length == 0) {
            this.line_buffer = word;
        } else if ((word.length + this.line_buffer.length + 1) <= this.wrap) {
            this.line_buffer += ' ' + word;
        } else {
            this.pushLine(this.line_buffer);
            this.line_buffer = word;
        }
    },

    flush: function() {
        if (this.line_buffer.length) {
            this.pushLine(this.line_buffer);
            this.line_buffer = '';
        }
    },

};

var FlapDemo = function(element) {
    var _this = this;

    var onAnimStart = function(e) {
        var $display = $(e.target);
        $display.prevUntil('.flapper', '.activity').addClass('active');
    };

    var onAnimEnd = function(e) {
        var $display = $(e.target);
        $display.prevUntil('.flapper', '.activity').removeClass('active');
    };

    this.opts = {
        chars_preset: 'alphanum',
        align: 'left',
        width: 20,
        on_anim_start: onAnimStart,
        on_anim_end: onAnimEnd
    };

    this.timers = [];

    this.$displays = element;

    this.line_delay = 300;
    this.screen_delay = 7000;

    element.flapper(this.opts);

    var text = _this.cleanInput(element.text());

    var buffers = _this.parseInput(text);

    _this.stopDisplay();
    _this.updateDisplay(buffers);
};

FlapDemo.prototype = {

    cleanInput: function(text) {
        return text.trim().toUpperCase();
    },

    parseInput: function(text) {
        var buffer = new FlapBuffer(this.opts.width, 1);
        var words = text.split(/\s/);
        for (j in words) {
            buffer.pushWord(words[j]);
        }
        buffer.flush();

        return buffer.buffers;
    },

    stopDisplay: function() {
        for (i in this.timers) {
            clearTimeout(this.timers[i]);
        }

        this.timers = [];
    },

    updateDisplay: function(buffers) {
        var _this = this;
        var timeout = 100;

        for (i in buffers) {

            _this.$displays.each(function(j) {

                var $display = $(_this.$displays[j]);

                (function(i,j) {
                    _this.timers.push(setTimeout(function(){
                        if (buffers[i][j]) {
                            $display.text(buffers[i][j]).change();
                        } else {
                            $display.text('').change();
                        }
                    }, timeout));
                } (i, j));

                timeout += _this.line_delay;
            });

            timeout += _this.screen_delay;
        }
    }

};

$(document).ready(function(){
  updateFlapper();
})

function updateFlapper(){
  $('.topic-list .main-link a.title').addClass("XS");
  $('.topic-list .main-link a.title').each(function(){
    flapperize($(this));
  })
}
var time = 100;
function flapperize(element){
  setTimeout(function(){new FlapDemo(element);}, time);
  time += 1500;
}