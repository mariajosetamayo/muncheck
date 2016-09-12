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

  	//<--* En esta parte funcion llamamos y damos al servidor de youtube los parametros que solicita para mandarnos la informacion que necesitamos. *-->

  		// var params = {
    // 		"content-Type": "application/json",
    // 		x-app-id: "c7faf842",
    // 		x-app-key: "bc4a198b34d738f0f52d5f874775d99d"
  		// };

  //<--* Por medio de get, obtenemos obtenemos lo que necesitamos del servidor (en este caso videos correspondientes a la palabra que buscamos) y los ponemos dentro de la funcion showResults. Items es el key de cada video. *-->

  		$.ajax({
    		url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
    		type: 'post',
    		data: {
 			"query":"searchTerm",
 			"timezone": "US/Eastern"
		},
    		headers: {
    			"Content-Type" : "application/json",
        		"x-app-id": "c7faf842",   //If your header name has spaces or any other char not appropriate
        		"x-app-key": "f06e1c4ce5415a0155b0c0010294b93e",  //for object property name, use quoted notation shown in second
        		"x-remote-user-id" :0,
    		},
    		dataType: 'json',
    		success: function (data) {
        	console.info(data);
    		}
		});
	}

	// function showResults(results){

 //  //<--* Aqui hacemos una variable de html vacia a la que luego le vamos a anadir los resultados de la busqueda (ie. los videos). Luego metemos esa variable al div contenido en el html, asi lo modificamos para que se muestren los resultados de la busqueda. *--> 

 //  		var html = "";
 //  		$.each(results, function(index,value){
   
 //   // <--* este codigo comentado es para que se muestren los videos en la pagina con thumbnails y al darle click lleve a una pagina separada de youtube. *-->

 //      // html += '<li class="results">' +   value.snippet.title +  '<br/><br/>' + '<a href="https://www.youtube.com/watch?v=' + value.id.videoId +  '"><img class="thumbnail" src="' + value.snippet.thumbnails.medium.url+ '"></a>' + '<br/>' + '<p>' + value.snippet.description + '</p>' + '</li>' + '<br/><br/>'});

 //  // <--* este es codigo moficado en el que pongo un id especifico a cada video para identificarlo unicamente y que cuando se le de click, se diferencie de los otros videos *-->

 //      	html += '<li class="results">' +   value.snippet.title +  '<br/><br/>' + '<a><img id="'+ value.id.videoId+'" class="thumbnail" src="' + value.snippet.thumbnails.medium.url+ '"></a>' + '<br/>' + '<p>' + value.snippet.description + '</p>' + '</li>' + '<br/><br/>'

 //    });

});