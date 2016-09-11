$(document).ready(function(){


function show(shown, hidden) {
  document.getElementById(shown).style.display='block';
  document.getElementById(hidden).style.display='none';
  return false;
}

$("#submit").click(function(){
	return show("page2", "page1")
})

$("#searchAgain").click(function(){
	return show("page1", "page2")
})

});