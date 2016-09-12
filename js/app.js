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

	$(".what").click(function(){
    		$(".overlay").fadeIn(1000);
  	});

 	/*--- Hide information modal box ---*/
  	
	$("a.close").click(function(){
  			$(".overlay").fadeOut(1000);
 	});

	});