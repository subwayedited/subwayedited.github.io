function placeBsBtn(){
	var importBtn = "<button class='bs-btn bs-btn-default'>Import</button>";
    $("#import-1_wrapper").append(importBtn);
    $(".bs-btn").click(function() {
		var pokes = document.getElementsByClassName("import-team-text")[0].value;
		addSets(pokes);     
    });
	

}
function getAbility(row){
	//ability = row[1].trim();
	ability = "Truant";
	if (ABILITIES_XY.indexOf(ability) != -1){
		return(ability);

	}else{
		return;

	}

}

function statConverter(stat){
	switch(stat){
		case 'hp':
			return "hp";
		case 'atk':
			return "at";
		case 'def':
			return "df";
		case 'spa':
			return "sa";
		case 'spd':
			return "sd";
		case 'spe':
			return "sp";

	}
	

}

function getStats(currentPoke,rows,i){
	currentPoke.nature = "Serious";
	var currentEV;
	var currentIV;
	var currentNature;
	currentPoke.level = 50;
	for(x = i;x<i+6;x++){
		var currentRow = rows[x].split("|");
		var evs = new Object();
		var ivs = new Object();
		var ev

	//	switch(currentRow[8]){
			//case 'Level':
			//	currentPoke.level = parseInt("50");
			//	break;
			//case 'EVs':
			//	
			//	for(j = 1;j<currentRow.length;j++){
			//		currentEV = currentRow[j].trim().split(" ");
			//		currentEV[1] = statConverter(currentEV[1].toLowerCase());
			//		evs[currentEV[1]] = parseInt(currentEV[0]);

			//	}
        
        preevs = currentRow[8].split("/")
        for (i in preevs) {
           var amount = 510 / preevs.length;
           theev = amount + " " + i.toLowerCase();
           currentEV = theev.split(" ");
           currentEV = statConverter(currentEV[1]);
           evs[currentEV[1]] = parseInt(currentEV[0]);
        }
				currentPoke.evs = evs;
		//		break;
	//		case 'IVs':	
		//		for(j = 1;j<currentRow.length;j++){
		//			currentIV = currentRow[j].trim().split(" ");
		//			currentIV[1] = statConverter(currentIV[1].toLowerCase());
		//			ivs[currentIV[1]] = parseInt(currentIV[0]);
		//		}
		//		currentPoke.ivs = ivs;
		//		break;

		}
		//currentNature = rows[x].trim().split(" ");
		//if ( currentNature[1] == "Nature"){
  	currentPoke.nature = currentRow[2];

		//}
	}
	return currentPoke;
	
	
}

function getItem(currentRow,j){
	for(;j<currentRow.length;j++){
		var item = currentRow[j].trim();
		if(ITEMS_XY.indexOf(item) != -1){
			return item;

		}
	}
	return;

}

function getMoves(currentPoke,currentRow,i){
	//var movesFound = false;
	//var moves = new Array();
  //
	var moves = [currentRow[4], currentRow[5], currentRow[6], currentRow[7];
	//for(x = i;x<i+10;x++){
//
	//	if(rows[x]){
		//	if(rows[x][0] == "-"){
		//		movesFound = true;
		//		
		//		var move = rows[x].substr(2,rows[x].length-2).replace("[","").replace("]","");	
		//		moves.push(move);
	
//			}else {
//				if (movesFound == true){
//					break;
	
//				}
//	
//			}			
//		}
//	}
	currentPoke.moves = moves;
	return currentPoke;
	
	

}

function addToDex(poke){
	var dexObject = new Object();
	if(SETDEX_XY[poke.name] == undefined){
		SETDEX_XY[poke.name] = new Object();
	}
	if (poke.ability !== undefined){
		dexObject.ability = poke.ability;

	}
	dexObject.level = poke.level;
	dexObject.evs = poke.evs;
	dexObject.ivs = poke.ivs;
	dexObject.moves = poke.moves;
	dexObject.nature = poke.nature;
	dexObject.item = poke.item;
	if(localStorage.customsets){
		customsets = JSON.parse(localStorage.customsets);
	}
	else{
		customsets = {};
	}
	if(!customsets[poke.name]){
		customsets[poke.name] = {};
	}
	customsets[poke.name][poke.nameProp] = dexObject;
	if(poke.name == "Aegislash-Blade"){
		if(!customsets["Aegislash-Shield"]){
			customsets["Aegislash-Shield"] = {};
		}
		customsets["Aegislash-Shield"][poke.nameProp] = 	dexObject;
	}
	updateDex(customsets);
}

function updateDex(customsets){
	for(pokemon in customsets){
		for(moveset in customsets[pokemon]){
			if(!SETDEX_XY[pokemon]){
				SETDEX_XY[pokemon] = {};
			}
			SETDEX_XY[pokemon][moveset] = customsets[pokemon][moveset];
		}
	}
	localStorage.customsets = JSON.stringify(customsets);
}

function addSets(pokes){
	var rows = pokes.split("\n");
	var currentRow;
	var currentPoke;
	var addedpokes = 0;
	for (i = 0; i < rows.length; i++) {
		currentRow = rows[i].split("|");
		for (j = 0; j<currentRow.length;j++){
			currentRow[j] = checkExeptions(currentRow[j].trim());
			if(POKEDEX_XY[currentRow[1].trim()] !== undefined){
				currentPoke = POKEDEX_XY[currentRow[1].trim()];
				currentPoke.name = currentRow[1].trim();
				currentPoke.item = getItem(currentRow,3);
				//if(j===1){
				//	currentPoke.nameProp = currentRow[j-1].trim();

				//}else{
					currentPoke.nameProp = "Set #" + currentRow[0];

				//}
				//currentPoke.ability = getAbility(rows[i+1].split(":"));
				currentPoke.ability = "Snow Cloak";
				currentPoke = getStats(currentPoke,rows,i+2);
				currentPoke = getMoves(currentPoke,rows,i+2);
				addToDex(currentPoke);
				addedpokes++;

			}
		}		
	}
	alert("Successfully imported "+addedpokes+" sets");
}

function checkExeptions(poke){
	switch(poke){
		case 'Houndoom-Mega':
			poke = "Mega Houndoom";
			break;
		case 'Venusaur-Mega':
			poke = "Mega Venusaur";
			break;
		case 'Blastoise-Mega':
			poke = "Mega Blastoise";
			break;
		case 'Alakazam-Mega':
			poke = "Mega Alakazam";
			break;
		case 'Gengar-Mega':
			poke = "Mega Gengar";
			break;
		case 'Kangaskhan-Mega':
			poke = "Mega Kangaskhan";
			break;
		case 'Pinsir-Mega':
			poke = "Mega Pinsir";
			break;
		case 'Gyarados-Mega':
			poke = "Mega Gyarados";
			break;
		case 'Aerodactyl-Mega':
			poke = "Mega Aerodactyl";
			break;
		case 'Ampharos-Mega':
			poke = "Mega Ampharos";
			break;
		case 'Scizor-Mega':
			poke = "Mega Scizor";
			break;
		case 'Heracross-Mega':
			poke = "Mega Heracross";
			break;
		case 'Tyranitar-Mega':
			poke = "Mega Tyranitar";
			break;
		case 'Blaziken-Mega':
			poke = "Mega Blaziken";
			break;
		case 'Gardevoir-Mega':
			poke = "Mega Gardevoir";
			break;
		case 'Mawile-Mega':
			poke = "Mega Mawile";
			break;
		case 'Aggron-Mega':
			poke = "Mega Aggron";
			break;
		case 'Medicham-Mega':
			poke = "Mega Medicham";
			break;
		case 'Manectric-Mega':
			poke = "Mega Manectric";
			break;
		case 'Banette-Mega':
			poke = "Mega Banette";
			break;
		case 'Absol-Mega':
			poke = "Mega Absol";
			break;
		case 'Garchomp-Mega':
			poke = "Mega Garchomp";
			break;
		case 'Lucario-Mega':
			poke = "Mega Lucario";
			break;
		case 'Beedrill-Mega':
			poke = "Mega Beedrill";
			break;
		case 'Pidgeot-Mega':
			poke = "Mega Pidgeot";
			break;
		case 'Slowbro-Mega':
			poke = "Mega Slowbro";
			break;
		case 'Steelix-Mega':
			poke = "Mega Steelix";
			break;
		case 'Sceptile-Mega':
			poke = "Mega Sceptile";
			break;
		case 'Swampert-Mega':
			poke = "Mega Swampert";
			break;
		case 'Sableye-Mega':
			poke = "Mega Sableye";
			break;
		case 'Sharpedo-Mega':
			poke = "Mega Sharpedo";
			break;
		case 'Camerupt-Mega':
			poke = "Mega Camerupt";
			break;
		case 'Altaria-Mega':
			poke = "Mega Altaria";
			break;
		case 'Salamence-Mega':
			poke = "Mega Salamence";
			break;
		case 'Metagross-Mega':
			poke = "Mega Metagross";
			break;
		case 'Latias-Mega':
			poke = "Mega Latias";
			break;
		case 'Latios-Mega':
			poke = "Mega Latios";
			break;
		case 'Rayquaza-Mega':
			poke = "Mega Rayquaza";
			break;
		case 'Lopunny-Mega':
			poke = "Mega Lopunny";
			break;
		case 'Gallade-Mega':
			poke = "Mega Gallade";
			break;
		case 'Audino-Mega':
			poke = "Mega Audino";
			break;
		case 'Diancie-Mega':
			poke = "Mega Diancie";
			break;
		case 'Charizard-Mega-X':
			poke = "Mega Charizard X";
			break;
		case 'Charizard-Mega-Y':
			poke = "Mega Charizard Y";
			break;
		case 'Mewtwo-Mega-X':
			poke = "Mega Mewtwo X";
			break;
		case 'Mewtwo-Mega-Y':
			poke = "Mega Mewtwo Y";
			break;
		case 'Groudon-Primal':
			poke = "Primal Groudon";
			break;
		case 'Kyogre-Primal':
			poke = "Primal Kyogre";
			break;
		case 'Rotom-Fan':
			poke = "Rotom-S";
			break;
		case 'Rotom-Mow':
			poke = "Rotom-C";
			break;
		case 'Rotom-Frost':
			poke = "Rotom-F";
			break;
		case 'Rotom-Wash':
			poke = "Rotom-W";
			break;
		case 'Rotom-Heat':
			poke = "Rotom-H";
			break;
		case 'Meowstic-F':
			poke = "Meowstic";
			break;
		case 'Kyurem-Black':
			poke = "Kyurem-B";
			break;
		case 'Kyurem-White':
			poke = "Kyurem-W";
			break;
		case 'Landorus-Therian':
			poke = "Landorus-T";
			break;
		case 'Tornadus-Therian':
			poke = "Tornadus-T";
			break;
		case 'Thundurus-Therian':
			poke = "Thundurus-T";
			break;
		case 'Giratina-Origin':
			poke = "Giratina-O";
			break;
		case 'Gourgeist':
			poke = "Gourgeist-Average";
			break;	
		case 'Shaymin-Sky':
			poke = "Shaymin-S";
			break;
		case 'Wormadam-Sandy':
			poke = "Wormadam-G";
			break;
		case 'Wormadam-Trash':
			poke = "Wormadam-S";
			break;
		case 'Deoxys-Attack':
			poke = "Deoxys-A";
			break;
		case 'Deoxys-Defense':
			poke = "Deoxys-D";
			break;
		case 'Deoxys-Speed':
			poke = "Deoxys-S";
			break;
		case 'Aegislash':
			poke = "Aegislash-Blade";
			break;
		case 'Pikachu-Belle':	
		case 'Pikachu-Cosplay':	
		case 'Pikachu-Libre':
		case 'Pikachu-PhD':	
		case 'Pikachu-Pop-Star':	
		case 'Pikachu-Rock-Star':
			poke = "Pikachu";
			break;
	}
	return poke;
	
}

$(document).ready(function() {
    placeBsBtn();
	if(localStorage.customsets){
		updateDex(JSON.parse(localStorage.customsets));
	}
});
