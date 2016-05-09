var options = {
  width: 6,             // number of digits
  align: 'left',       // aligns values to the left or right of display
  padding: '&nbsp;',    // value to use for padding
  chars: null,          // array of characters that Flapper can display
  chars_preset: 'alphanum'  // 'num', 'hexnum', 'alpha' or 'alphanum'
}

$(document).ready(function(){
  $('.topic-list-item a:first').each(function(){
    $(this).addClass("XS");
    $(this).flapper(options);
  });
})