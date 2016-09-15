$(document).ready(function(){

	var userPrefs = {
		hasDiabetes: false,
		hasKidneyDisease: false,
		wantsToLoseWeight: false
		//numberOfPortions
	}
	var allNutrientInfo = window.nutrientField;

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
		$("#searchBox").val("")
		userPrefs[window.selectedDisease] =  false
		$(".disease").removeClass("diseaseToggle");
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

 	$(".logo").click(function(){
 		$("#searchBox").val("");
 	})



	//<--* variables to obtain user input *-->

	$(".disease").click(function(event){
		event.preventDefault();
		window.selectedDisease = $(this).attr("id")// obtienes el id con jquery.
		console.log("yeii", selectedDisease)
		userPrefs[window.selectedDisease] =  true
		console.log("noo", userPrefs)
		$(this).toggleClass("diseaseToggle");// jQuery Para que se vea aplastado (pintarle verde).
	})
	
	$("#submitBtn").click(function(event){
  		event.preventDefault();
  		var userFoodInput = document.getElementById("searchBox").value
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
    			"x-app-id": "c7faf842",  
    			"x-app-key": "bc4a198b34d738f0f52d5f874775d99d",  
  			},
  			dataType: 'json',
  			success: function (data) {
    			// Este console.log te muestra el objeto que retornas
    			console.info(data);
    
    			//Mostrar elemento en pantalla
    			showNutritionalValue(data)
    			var isRecommended = isFoodRecommended(data);
				showRecomendation(isRecommended);
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
		document.getElementById("foodItem").value = ""
		document.getElementById("foodItem").value = ""
		$("#foodPhoto").attr('src', data.foods[0].photo.thumb)
		$("#foodItem").text(data.foods[0].food_name)

		for (var i=0; i< data.foods[0].full_nutrients.length; i++){
			var nutrient = data.foods[0].full_nutrients[i];
			var nutrientID = nutrient.attr_id;
			// console.log(nutrientID); te imprime toodos los ides de los full_nutrients, un opor uno.
			// var name = (window.nutrientField[nutrientID]) ? window.nutrientField[nutrientID].name : '';
			if (window.nutrientField[nutrientID]) {
				var name = window.nutrientField[nutrientID].name;
				if (nutrient.value !== 0) {
					$("#micronutrientsResults").append(
						"<li>" + name + ": " + nutrient.value + " " + window.nutrientField[nutrientID].unit + "</li>"
					)
				}
			}
		}

		$(".performance-facts__title").text(data.foods[0].serving_weight_grams + " grams")
		$("#calories").text(data.foods[0].nf_calories + " Kcal")
		$("#total_fat").text(data.foods[0].nf_total_fat + " g");
		$("#saturated_fat").text(data.foods[0].nf_saturated_fat + " g");
		$("#cholesterol").text(data.foods[0].nf_cholesterol + "mg");
		$("#sodium").text(data.foods[0].nf_sodium + " mg");
		$("#total_carbs").text(data.foods[0].nf_total_carbohydrate + " g");
		$("#dietary_fiber").text(data.foods[0].nf_dietary_fiber + " g");
		$("#sugar").text(data.foods[0].nf_sugars + " g");
		$("#protein").text(data.foods[0].nf_protein + " g");
	
	}

	function isFoodRecommended(data){
		var isRecommended = true;
		// console.log ("yeii", isRecommended)
		for (var i=0; i< data.foods[0].full_nutrients.length; i++){
			var nutrient = data.foods[0].full_nutrients[i];
			var nutrientID = nutrient.attr_id;
			// console.log(nutrientID); te imprime toodos los ides de los full_nutrients, un opor uno.
			if(nutrientID === 305){
			 	var phosphorus = nutrient.value;
				console.log(phosphorus)
			}
			if(nutrientID === 605){
			 	var transFat = nutrient.value;
				console.log(phosphorus)
			}
		}

		if (userPrefs.hasDiabetes){ // solo se ejecuta si el usuario selecciono ese boton en la primera pantalla.
			if((data.foods[0].nf_total_carbohydrate>=30) || (data.foods[0].nf_saturated_fat>1) || (transFat>0) || (data.foods[0].serving_weight_grams<15 && data.foods[0].nf_calories> 30)){
				isRecommended = false;
			}
		}
		if (userPrefs.hasKidneyDisease){
			if((data.foods[0].nf_potassium>=200) || (phosphorus>= 150) || (data.foods[0].nf_sodium>=200)){
				isRecommended = false;
			}
		}
		if (userPrefs.wantsToLoseWeight){
			if((data.foods[0].nf_calories> 200) || data.foods[0].nf_total_carbohydrate>60 || (data.foods[0].nf_saturated_fat>50) || (transFat>0) || (data.foods[0].serving_weight_grams<15 && data.foods[0].nf_calories> 30)){
				isRecommended = false;
			}
		}
		return isRecommended;
	}

	function showRecomendation(isRecommended){
		$("#results2").empty()
		if (isRecommended){
			// document.getElementById("resultsContainer").style.backgroundColor = "lightblue";
			$(".resultsContainer").addClass("recommendedContainer")//Pintar de verde el div
			$(".resultsContainer").removeClass("notRecommendedContainer")
			$("#results2").append("<h2> Recommended!!! </h2>")
		} else  {
			// Aparezca texto "Not Rec"
			$("#results2").append("<h2> Not Recommended!!! </h2>")
			$(".resultsContainer").addClass("notRecommendedContainer")//Pintarle de rojo al texto.
			$(".resultsContainer").removeClass("recommendedContainer")
		}
	}
	
	
});