$(document).ready(function(){

	//<--* function to change between page1 and page2 *-->

	function show(shown, hidden) {
  		document.getElementById(shown).style.display='block';
  		document.getElementById(hidden).style.display='none';
  		return false;
	}

	$("#submitBtn").click(function(){
		return show("page2", "page1")
	})

	$("#searchAgain").click(function(){
		return show("page1", "page2")
	})

	//<--* show instructions information modal box *-->

	$(".what").click(function(){
    		$(".overlay").fadeIn(1000);
  	});

 	 // <--* Hide instructions information modal box *-->
  	
	$("a.close").click(function(){
  			$(".overlay").fadeOut(1000);
 	});

	//<--* variables to obtain user input *-->

	$('#submitBtn').click(function(event){
  		event.preventDefault();
  		var userFoodInput = document.getElementById("searchBox").value
  		var diabetes = document.getElementById("diabetesBtn").value
  		var kidney = document.getElementById("kidneyBtn").value
  		var weight = document.getElementById("weightBtn").value
  		var checkRecipe = document.getElementById('recipeCheck').checked;
  		var recipePortion = document.getElementById("portionBox").value
		console.log("siii", userFoodInput)
		console.log("sii", recipePortion)
  		getFoodRequest(userFoodInput)
	});
	

	function getFoodRequest(searchTerm){

  // 		$.ajax({
  // 			async: true,
  // 			crossDomain: true,
  //   		url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
  //   		processData: false,
  //   		method: 'POST',
  //   		data: {
	 // 			query: "apple",
	 // 			timezone: "US/Eastern",
		// 	},
  //   		headers: {
  //   			"content-type": "application/json",
		//     	"x-app-id": "c7faf842",
		//     	"x-app-key": "bc4a198b34d738f0f52d5f874775d99d",
  //   		},
		// }).done(function (response) {
		// 	console.log(response)
		// });

		// var data = JSON.stringify({
		//   	"query": searchTerm,
		//   	"timezone": "US/Eastern"
		// })

		var settings = {
		  	url: "https://trackapi.nutritionix.com/v2/natural/nutrients",
		  	method: "POST",
		  	headers: {
		    	"content-type": "application/json",
		    	"x-app-id": "c7faf842",
		    	"x-app-key": "bc4a198b34d738f0f52d5f874775d99d",
		  	},
		  	data: "{\n\t\"query\":\"bigmac\",\n\t\"timezone\":\"US/Eastern\"\n}\n\n"
		 //  	data: {
	 	// 		"query": "apple",
	 	// 		"timezone": "US/Eastern",
			// },
			// error: function (err) {
			// 	console.log(err)
			// }
		}

		$.ajax(settings).done(function (response) {
		  	console.log(response);
		});
	}

	
});