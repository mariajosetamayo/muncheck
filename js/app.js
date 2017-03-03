// View 1
var searchFoodBox = $("#searchBox");
var diseasesBtns = $(".disease");
var submitFoodQueryBtn = $("#submitBtn");
var showInstructionsBtn = $(".what");
var instructionsOverlay = $(".overlay");
var closeOverlayBtn = $("#close");

// View 2
var resultsContainer = $(".resultsContainer");
var recommendationContainer = $("#results2");
var foodPhoto = $("#foodPhoto");
var foodItemNameContainer = $("#foodItem");
var micronutrientsResultsContainer = $("#micronutrientsResults");
var nutritionalInfoTableHeading = $(".performance-facts__title");
var caloriesTableField = $("#calories");
var totalFatTableField = $("#total_fat");
var saturatedFatTableField = $("#saturated_fat");
var cholesterolTableField = $("#cholesterol");
var sodiumTableField = $("#sodium");
var totalCarbsTableField = $("#total_carbs");
var dietaryFiberTableField = $("#dietary_fiber");
var sugarTableField = $("#sugar");
var proteinTableField = $("#protein");
var searchFoodAgainBtn = $(".searchAgain");

// View 1 and 2
var muncheckLogo = $(".logo");

// Variable to access the micronutrient information from the nutrientField object in nutrientFieldObj.js
var allNutrientInfo = window.nutrientField;

// State Object for keeping track of User Preferences
var userPrefs = {
	hasDiabetes: false,
	hasKidneyDisease: false,
	wantsToLoseWeight: false,
};

/////////// Application's logic ////////////

// AJAX call to the Nutritionix API //
function getFoodData(searchTerm){
	var data = {
		"query": searchTerm,
		"timezone": "US/Eastern",
	};

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
			var isRecommended = isFoodRecommended(data);
			showNutritionalValue(data);
			showRecomendation(isRecommended);
		},
		error: function (request, status, error) {
			var errorElem = showError(error);
		},
	});
}

function isFoodRecommended(data){
	var isRecommended = true;

	for (var i=0; i< data.foods[0].full_nutrients.length; i++){
		var nutrient = data.foods[0].full_nutrients[i];
		var nutrientID = nutrient.attr_id;
		if(nutrientID === 305){
			var phosphorus = nutrient.value;
		}
		if(nutrientID === 605){
			var transFat = nutrient.value;
		}
	}

	if (userPrefs.hasDiabetes){
		if((data.foods[0].nf_total_carbohydrate>=30) || (data.foods[0].nf_saturated_fat>1) || (transFat>0) || (data.foods[0].serving_weight_grams<15 && data.foods[0].nf_calories> 30) || (data.foods[0].serving_weight_grams<15 && data.foods[0].nf_sugars> 3)){
			isRecommended = false;
		}
	}
	if (userPrefs.hasKidneyDisease){
		if((data.foods[0].nf_potassium>=200) || (phosphorus>= 150) || (data.foods[0].nf_sodium>=200)){
			isRecommended = false;
		}
	}
	if (userPrefs.wantsToLoseWeight){
		if((data.foods[0].nf_calories> 200) || data.foods[0].nf_total_carbohydrate>60 || (data.foods[0].nf_saturated_fat>50) || (transFat>0) || (data.foods[0].serving_weight_grams<10 && data.foods[0].nf_calories> 30)){
			isRecommended = false;
		}
	}

	if ((userPrefs.hasDiabetes === false) && (userPrefs.hasKidneyDisease === false) && (userPrefs.wantsToLoseWeight === false)){
		if ((data.foods[0].nf_total_carbohydrate>=60) || (data.foods[0].nf_calories> 200) || (data.foods[0].serving_weight_grams<15 && data.foods[0].nf_calories> 30) || (data.foods[0].nf_saturated_fat>3) || (transFat>0) || (data.foods[0].serving_weight_grams<15 && data.foods[0].nf_calories> 30)){
			isRecommended = false;
		};
	}
	return isRecommended;
};

/////// Event listeners for View 1 ////////
submitFoodQueryBtn.click(function(){
	return showCorrectView("page2", "page1");
});

showInstructionsBtn.click(function(){
	instructionsOverlay.fadeIn(1000);
});

closeOverlayBtn.click(function(){
	instructionsOverlay.fadeOut(1000);
});

muncheckLogo.click(function(){
	searchFoodBox.val("");
});

diseasesBtns.click(function(event){
	event.preventDefault();
	window.selectedDisease = $(this).attr("id");
	userPrefs[window.selectedDisease] = true;
	$(this).toggleClass("diseaseToggle"); // Changes background color of buttons when clicked.
});

submitFoodQueryBtn.click(function(event){
	event.preventDefault();
	var userFoodInput = searchFoodBox.val();
	getFoodData(userFoodInput);
});

/////// Event listeners for View 2 ///////
searchFoodAgainBtn.click(function(){
	userPrefs.hasDiabetes = false;
	userPrefs.hasKidneyDisease = false;
	userPrefs.wantsToLoseWeight = false;
	searchFoodBox.val("");
	userPrefs[window.selectedDisease] =  false;
	diseasesBtns.removeClass("diseaseToggle");
	resultsContainer .removeClass("notFoundContainer");
	return showCorrectView("page1", "page2");
});

/////// DOM manipulation for View 1 and 2 ///////
function showCorrectView(shown, hidden) {
	document.getElementById(shown).style.display='block';
	document.getElementById(hidden).style.display='none';
	return false;
};

/////// DOM manipulation for View 2 ///////
var showError = function(error){
	resultsContainer.addClass("notFoundContainer");
	var errorText = recommendationContainer.append("<h2> This food is not available. Please search again. </h2>");
	errorElem.append(errorText);
};

function showNutritionalValue(data){
  	foodItemNameContainer.val("");
	foodPhoto.attr('src', data.foods[0].photo.thumb);
	foodItemNameContainer.text(data.foods[0].food_name);

	for (var i=0; i< data.foods[0].full_nutrients.length; i++){
		var nutrient = data.foods[0].full_nutrients[i];
		var nutrientID = nutrient.attr_id;
		if (window.nutrientField[nutrientID]) {
			var name = window.nutrientField[nutrientID].name;
			if (nutrient.value !== 0) {
				micronutrientsResultsContainer.append(
					"<li>" + name + ": " + nutrient.value + " " + window.nutrientField[nutrientID].unit + "</li>"
				);
			}
		}
	}
	
	nutritionalInfoTableHeading.text("Nutrition information for a portion size of:"+ " " + " " + data.foods[0].serving_weight_grams + " grams");
	caloriesTableField.text(data.foods[0].nf_calories + " Kcal");
	totalFatTableField .text(data.foods[0].nf_total_fat + " g");
	saturatedFatTableField.text(data.foods[0].nf_saturated_fat + " g");
	cholesterolTableField.text(data.foods[0].nf_cholesterol + "mg");
	sodiumTableField.text(data.foods[0].nf_sodium + " mg");
	totalCarbsTableField.text(data.foods[0].nf_total_carbohydrate + " g");
	dietaryFiberTableField.text(data.foods[0].nf_dietary_fiber + " g");
	sugarTableField.text(data.foods[0].nf_sugars + " g");
	proteinTableField.text(data.foods[0].nf_protein + " g");
}

function showRecomendation(isRecommended){
	recommendationContainer.empty()
	if (isRecommended){
		resultsContainer.addClass("recommendedContainer"); //changes background to green
		resultsContainer.removeClass("notRecommendedContainer");
		recommendationContainer.append("<h2> Recommended!!! </h2>");
	} else  {
		recommendationContainer.append("<h2> Not Recommended!!! </h2>");
		resultsContainer.addClass("notRecommendedContainer"); //changes background to red
		resultsContainer.removeClass("recommendedContainer");
	}
};

$(document).ready(function(){
	showCorrectView("page1", "page2");
});
