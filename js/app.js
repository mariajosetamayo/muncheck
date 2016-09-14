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
	
	$("#submitBtn").click(function(event){
  		event.preventDefault();
  		var userFoodInput = document.getElementById("searchBox").value
  		window.diabetes = document.getElementById("diabetesBtn").value
  		var kidney = document.getElementById("kidneyBtn").value
  		var weight = document.getElementById("weightBtn").value
  		var checkRecipe = document.getElementById('recipeCheck').checked;
  		var recipePortion = document.getElementById("portionBox").value
		console.log("siii", userFoodInput)
		console.log("sii", recipePortion)
  		getFoodRequest(userFoodInput)
  		
	});

	

	function getFoodRequest(searchTerm){

		var searchTerm= searchTerm;
		var data =   {
 			"query": searchTerm,
  			"timezone": "US/Eastern"
		}

		$.ajax({
  			url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
  			type: 'POST',
  			data: JSON.stringify(data),
  			headers: {
    			"Content-Type" : "application/json",
    			"x-app-id": "745718c2",  
    			"x-app-key": "d629dae08b944df9629b91f8c1dca886",  
  			},
  			dataType: 'json',
  			success: function (data) {
    			// Este console.log te muestra el objeto que retornas
    			console.info(data);
    
    			//Mostrar elemento en pantalla
    			showNutritionalValue(data)
    			diabetesReccomendation(data)
  			},
  			error: function (request, status, error) {
    			// Estos console.log te dan informacion del error.
    			console.log(request.responseText);
    			console.log(error);
    			console.log(status);
  			}
		});
	}
  	
  	function showNutritionalValue(data){
  // Funcion que contiene el jQuery para mostrar en la pantalla. 
  // Esto es la separacion de concerns. En la de arriba se hace el query, en 
  // esta se muestra todo en pantalla.
  		$("#foodPhoto").attr('src', data.foods[0].photo.thumb)
  		$("#foodItem").append("<p>" + data.foods[0].food_name + "</p>")
  		$("#micronutrientsResults").append("<ul>" + "<li>" + window.nutrientField[211].name + "</li>" + "<li>" + data.foods[0].full_nutrients[10].value + window.nutrientField[211].unit + "</li>" + "<li>" + window.nutrientField[306].name + "</li>" + "<li>" + data.foods[0].full_nutrients[20].value + window.nutrientField[306].unit + "</li>" + "</ul>")
  		$(".performance-facts__title").append("<p>" + data.foods[0].serving_unit + "</p>" + "<p>" + data.foods[0].serving_weight_grams + "grams" + "</p>")
		
	}
	
	function diabetesReccomendation(data){	
		if((data.foods[0].nf_total_carbohydrate>30) && (data.foods[0].nf_saturated_fat>1)) {
			data.foods["recommendation"] = "Not recommended"
		}
		else{
			
			data.foods["recommedation"] = "Recommended"
		}
		$("#diabetesBtn").click(function(event){
			event.preventDefault
			$("results2").append("<h2>" + data.foods[0].recommedation + "</h2>")
		})
	}

	



	
});