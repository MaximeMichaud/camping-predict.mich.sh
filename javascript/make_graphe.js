function plotActivity(x, y) 
{
	for (var i = 0; i < y.length; i++)
	{
		y[i] = parseInt(y[i]);
	}
	
	var nbLabel = Math.round(x.length/20);
	if (nbLabel < 1)
	{
		nbLabel = 1;
	}
	
    var chart;
    $(document).ready(function() {
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'activity',
                type: 'area',
				width: 810,
				height: 450,
				marginRight: 25,
				backgroundColor: '#FCFFC5',
				plotBackgroundColor: '#FCFFC5'
            },
            title: {
                text: 'Activité sur camping predict',
				style: {
					color: 'black'
				}
            },
            xAxis: {
                labels: {
                    formatter: function() {
                        return this.value; // clean, unformatted number for year
                    },
					rotation : 70,
					align: 'left'
                },
				categories: x,
				tickInterval: nbLabel
            },
            yAxis: {
                title: {
                    text: 'Nombre de visites',
					style: {
						color: 'black'
					}
                },
                labels: {
                    formatter: function() {
                        return this.value;
                    }
                }
            },
            tooltip: {
                formatter: function() {
                    return this.series.name +' : <b>'+
                        Highcharts.numberFormat(this.y, 0) +'</b> personnes<br/>le '+ this.x;
                }
            },
            plotOptions: {
                area: {
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            series: [{
                name: 'activité',
                data: y,
				color: '#683F24'
            }]
        });
    });   
}

var colors = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];

function plotStatBat(colors, data, km)
{
	var chart;
	$(document).ready(function() {
		chart = new Highcharts.Chart({
		  chart: {
			 renderTo: km+'km',
			 width: 400,
			 height: 310,
			 marginLeft: 100,
			 marginRight: 100,
			 backgroundColor: '#FCFFC5',
			plotBackgroundColor: '#FCFFC5'
		  },
//		  colors: colors,
		  title: {
			 text: "Bâtiment(s) à " + km + " km",
			 margin: 10
		  },
		  tooltip: {
        	    pointFormat: '=> <b>{point.percentage}%</b> ({point.y})',
            	percentageDecimals: 1
		},
		  plotOptions: {
			 pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
				   enabled: true,
				   formatter: function() {
					  return "" + this.point.name.toLowerCase() + "";
				   }
				}
			 },
			 series: {
				dataLabels: {
					enabled: true,
					color: 'black',
					fontSize: 3
				}
			}
		  },
		   series: [{
			 type: 'pie',
			 data: data
		  }]
	   });
	}); 
}

function plotSimuBat()
{
	var ville = parseInt($('input[type=radio][name=ville]:checked').attr('value'));
	var size = parseInt($("#size").val());
	var xmin = parseInt($("#xmin").val());
	var ymax = parseInt($("#ymax").val());
	
	var xmax = xmin + size - 1;
	var ymin = ymax - size + 1;
	
//	alert("size : " + size + " x : de " + xmin + " a " + xmax + " y : de " + ymin + " a " + ymax);
	
	var nbrCaseByKm = new Array();
	
	for (var i = 0; i <= 28; i++)
	{
		nbrCaseByKm[i] = 0;
	}
	
	var caseNbrUpTo4 = 0;
	var caseNbrHigherThan4 = 0;
	
	for (var i = xmin; i <= xmax; i++)
	{
		for (var j = ymin; j <= ymax; j++)
		{
			var km = Math.round(Math.sqrt((i*i)+(j*j)));
			nbrCaseByKm[km] += 1;
			
			if (km < 5)
			{
				caseNbrUpTo4 += 1;
			}
			else
			{
				caseNbrHigherThan4 += 1;
			}
		}
	}
	
	if (ville == 0 || ville == 1)
	{
		var nbrRuine = 1;
	}
	else if (ville == 2)
	{
		var nbrRuine = 2;
	}
	
	if (ville == 0)
	{
		var batNbr = 10;
	}
	else if (ville == 1 || ville == 2)
	{
		var batNbr = 20;
	}
		
	var freeCaseNbrUpTo4 = caseNbrUpTo4 - 1;//On enleve la ville
	var freeCaseNbrHigherThan4 = caseNbrHigherThan4 - nbrRuine;//On enleve les ruines
	var caseTot = freeCaseNbrUpTo4 + caseNbrHigherThan4;//Nbr total de case de l'OM
	
	var ratioCaseNbrUpTo4 = freeCaseNbrUpTo4/caseTot;
	var ratioCaseNbrHigherThan4 = 1 - ratioCaseNbrUpTo4;
	
	var statByCaseToHaveBatUpTo4= (batNbr*ratioCaseNbrUpTo4)/freeCaseNbrUpTo4;
	var statByCaseToHaveBatHigherThan4 = (batNbr*ratioCaseNbrHigherThan4)/freeCaseNbrHigherThan4;
		
	var stat = batNbr/((size*size)-1 - nbrRuine);		
		
//	alert(statByCaseToHaveBatUpTo4 + " " + statByCaseToHaveBatHigherThan4 + " " + stat);

	var nameBatTab = new Array();
	var statBatTab = new Array();
	
	nameBatTab[0] = "maison d'un c.";
	statBatTab[0] = ((nbrCaseByKm[1]*1) + (nbrCaseByKm[2]*(10/121)) + (nbrCaseByKm[3]*(10/230)) + (nbrCaseByKm[4]*(10/242)))*statByCaseToHaveBatUpTo4;
	
	nameBatTab[1] = "ambulance";
	statBatTab[1] = ((nbrCaseByKm[2]*(15/121)) + (nbrCaseByKm[3]*(5/230)) + (nbrCaseByKm[4]*(5/242)))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(5/273))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[2] = "cache de contr.";
	statBatTab[2] = ((nbrCaseByKm[2]*(15/121)) + (nbrCaseByKm[3]*(5/230)) + (nbrCaseByKm[4]*(5/242)))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(5/273))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[3] = "camion en p.";
	statBatTab[3] = ((nbrCaseByKm[2]*(15/121)) + (nbrCaseByKm[3]*(5/230)) + (nbrCaseByKm[4]*(5/242)))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(5/273))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[4] = "entrepôt d.";
	statBatTab[4] = ((nbrCaseByKm[2]*(15/121)) + (nbrCaseByKm[3]*(5/230)) + (nbrCaseByKm[4]*(5/242)))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(5/273))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[5] = "labo. c.";
	statBatTab[5] = ((nbrCaseByKm[2]*(15/121)) + (nbrCaseByKm[3]*(5/230)) + (nbrCaseByKm[4]*(5/242)))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(5/273))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[6] = "p. bois obscur";
	statBatTab[6] = ((nbrCaseByKm[2]*(6/121)) + (nbrCaseByKm[3]*(2/230)) + (nbrCaseByKm[4]*(2/242)))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(2/273))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[7] = "petite maison";
	statBatTab[7] = ((nbrCaseByKm[2]*(30/121)) + (nbrCaseByKm[3]*(10/230)) + (nbrCaseByKm[4]*(10/242)))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(10/273))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[8] = "carcasses de v.";
	statBatTab[8] = ((nbrCaseByKm[3]*(30/230)) + (nbrCaseByKm[4]*(10/242)))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(10/273) + nbrCaseByKm[6]*(10/315))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[9] = "carrière e.";
	statBatTab[9] = ((nbrCaseByKm[3]*(4/230)) + (nbrCaseByKm[4]*(2/242)))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(2/273) + nbrCaseByKm[6]*(2/315))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[10] = "caveau familial";
	statBatTab[10] = ((nbrCaseByKm[3]*(4/230)) + (nbrCaseByKm[4]*(2/242)))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(2/273) + nbrCaseByKm[6]*(2/315))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[11] = "caverne";
	statBatTab[11] = ((nbrCaseByKm[3]*(4/230)) + (nbrCaseByKm[4]*(2/242)))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(2/273) + nbrCaseByKm[6]*(2/315))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[12] = "cimetière i.";
	statBatTab[12] = ((nbrCaseByKm[3]*(15/230)) + (nbrCaseByKm[4]*(5/242)))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(5/273) + nbrCaseByKm[6]*(5/315))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[13] = "ecole mat. b.";
	statBatTab[13] = ((nbrCaseByKm[3]*(15/230)) + (nbrCaseByKm[4]*(5/242)))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(5/273) + nbrCaseByKm[6]*(5/315))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[14] = "kebab « c. c. »";
	statBatTab[14] = ((nbrCaseByKm[3]*(15/230)) + (nbrCaseByKm[4]*(5/242)))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(5/273) + nbrCaseByKm[6]*(5/315))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[15] = "parking d.";
	statBatTab[15] = ((nbrCaseByKm[3]*(30/230)) + (nbrCaseByKm[4]*(10/242)))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(10/273) + nbrCaseByKm[6]*(10/315))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[16] = "v. pompe hyd.";
	statBatTab[16] = ((nbrCaseByKm[3]*(36/230)) + (nbrCaseByKm[4]*(12/242)))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(12/273) + nbrCaseByKm[6]*(12/315))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[17] = "villa délabrée";
	statBatTab[17] = ((nbrCaseByKm[3]*(30/230)) + (nbrCaseByKm[4]*(10/242)))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(10/273) + nbrCaseByKm[6]*(10/315))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[18] = "ancien velib";
	statBatTab[18] = (nbrCaseByKm[4]*(9/242))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(3/273) + nbrCaseByKm[6]*(3/315) + nbrCaseByKm[7]*(3/142))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[19] = "carlingue d'av.";
	statBatTab[19] = (nbrCaseByKm[4]*(9/242))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(3/273) + nbrCaseByKm[6]*(3/315) + nbrCaseByKm[7]*(3/142))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[20] = "chantier à l'ab.";
	statBatTab[20] = (nbrCaseByKm[4]*(30/242))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(10/273) + nbrCaseByKm[6]*(10/315) + nbrCaseByKm[7]*(10/142))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[21] = "meubles kiela";
	statBatTab[21] = (nbrCaseByKm[4]*(15/242))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(5/273) + nbrCaseByKm[6]*(5/315) + nbrCaseByKm[7]*(5/142))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[22] = "parc à l'ab.";
	statBatTab[22] = (nbrCaseByKm[4]*(6/242))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(2/273) + nbrCaseByKm[6]*(2/315) + nbrCaseByKm[7]*(2/142))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[23] = "pharmacie d.";
	statBatTab[23] = (nbrCaseByKm[4]*(30/242))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(10/273) + nbrCaseByKm[6]*(10/315) + nbrCaseByKm[7]*(10/142))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[24] = "route barrée";
	statBatTab[24] = (nbrCaseByKm[4]*(3/242))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(1/273) + nbrCaseByKm[6]*(1/315) + nbrCaseByKm[7]*(1/142))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[25] = "supermarché p.";
	statBatTab[25] = (nbrCaseByKm[4]*(30/242))*statByCaseToHaveBatUpTo4 + (nbrCaseByKm[5]*(10/273) + nbrCaseByKm[6]*(10/315) + nbrCaseByKm[7]*(10/142))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[26] = "armurerie g.'n'z.";
	statBatTab[26] = (nbrCaseByKm[5]*(9/273) + nbrCaseByKm[6]*(3/315) + nbrCaseByKm[7]*(3/142) + nbrCaseByKm[8]*(3/164))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[27] = "bar miteux";
	statBatTab[27] = (nbrCaseByKm[5]*(30/273) + nbrCaseByKm[6]*(10/315) + nbrCaseByKm[7]*(10/142) + nbrCaseByKm[8]*(10/164))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[28] = "bricotout";
	statBatTab[28] = (nbrCaseByKm[5]*(30/273) + nbrCaseByKm[6]*(10/315) + nbrCaseByKm[7]*(10/142) + nbrCaseByKm[8]*(10/164))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[29] = "centrale hyd.";
	statBatTab[29] = (nbrCaseByKm[5]*(30/273) + nbrCaseByKm[6]*(10/315) + nbrCaseByKm[7]*(10/142) + nbrCaseByKm[8]*(10/164))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[30] = "stand de f. f.";
	statBatTab[30] = (nbrCaseByKm[5]*(15/273) + nbrCaseByKm[6]*(5/315) + nbrCaseByKm[7]*(5/142) + nbrCaseByKm[8]*(5/164))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[31] = "tranchée am.";
	statBatTab[31] = (nbrCaseByKm[5]*(15/273) + nbrCaseByKm[6]*(5/315) + nbrCaseByKm[7]*(5/142) + nbrCaseByKm[8]*(5/164))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[32] = "abri de chantier";
	statBatTab[32] = (nbrCaseByKm[6]*(21/315) + nbrCaseByKm[7]*(7/142) + nbrCaseByKm[8]*(7/164) + nbrCaseByKm[9]*(7/77))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[33] = "a. commissariat";
	statBatTab[33] = (nbrCaseByKm[6]*(30/315) + nbrCaseByKm[7]*(10/142) + nbrCaseByKm[8]*(10/164) + nbrCaseByKm[9]*(10/77))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[34] = "atomic' café";
	statBatTab[34] = (nbrCaseByKm[6]*(15/315) + nbrCaseByKm[7]*(5/142) + nbrCaseByKm[8]*(5/164) + nbrCaseByKm[9]*(5/77))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[35] = "bibli. de q.";
	statBatTab[35] = (nbrCaseByKm[6]*(9/315) + nbrCaseByKm[7]*(3/142) + nbrCaseByKm[8]*(3/164) + nbrCaseByKm[9]*(3/77))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[36] = "cabane de j.";
	statBatTab[36] = (nbrCaseByKm[6]*(30/315) + nbrCaseByKm[7]*(10/142) + nbrCaseByKm[8]*(10/164) + nbrCaseByKm[9]*(10/77))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[37] = "epicerie fargo";
	statBatTab[37] = (nbrCaseByKm[6]*(30/315) + nbrCaseByKm[7]*(10/142) + nbrCaseByKm[8]*(10/164) + nbrCaseByKm[9]*(10/77))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[38] = "fast-food";
	statBatTab[38] = (nbrCaseByKm[6]*(30/315) + nbrCaseByKm[7]*(10/142) + nbrCaseByKm[8]*(10/164) + nbrCaseByKm[9]*(10/77))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[39] = "bureau de poste";
	statBatTab[39] = (nbrCaseByKm[8]*(6/164) + nbrCaseByKm[9]*(2/77) + nbrCaseByKm[10]*(2/67) + nbrCaseByKm[11]*(2/37))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[40] = "mini-market";
	statBatTab[40] = (nbrCaseByKm[8]*(30/164) + nbrCaseByKm[9]*(10/77) + nbrCaseByKm[10]*(10/67) + nbrCaseByKm[11]*(10/37))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[41] = "relais auto.";
	statBatTab[41] = (nbrCaseByKm[8]*(15/164) + nbrCaseByKm[9]*(5/77) + nbrCaseByKm[10]*(5/67) + nbrCaseByKm[11]*(5/37))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[42] = "silos à l'ab.";
	statBatTab[42] = (nbrCaseByKm[8]*(15/164) + nbrCaseByKm[9]*(5/77) + nbrCaseByKm[10]*(5/67) + nbrCaseByKm[11]*(5/37))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[43] = "abri a.-a.";
	statBatTab[43] = (nbrCaseByKm[10]*(15/67) + nbrCaseByKm[11]*(5/37) + nbrCaseByKm[12]*(5/66) + nbrCaseByKm[13]*(5/32))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[44] = "gare de tr. d.";
	statBatTab[44] = (nbrCaseByKm[10]*(15/67) + nbrCaseByKm[11]*(5/37) + nbrCaseByKm[12]*(5/66) + nbrCaseByKm[13]*(5/32))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[45] = "immeuble d.";
	statBatTab[45] = (nbrCaseByKm[10]*(15/67) + nbrCaseByKm[11]*(5/37) + nbrCaseByKm[12]*(5/66) + nbrCaseByKm[13]*(5/32))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[46] = "a. aérodrome";
	statBatTab[46] = (nbrCaseByKm[12]*(6/66) + nbrCaseByKm[13]*(2/32) + nbrCaseByKm[14]*(2/17) + nbrCaseByKm[15]*(2/32))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[47] = "mine effondrée";
	statBatTab[47] = (nbrCaseByKm[12]*(15/66) + nbrCaseByKm[13]*(5/32) + nbrCaseByKm[14]*(5/17) + nbrCaseByKm[15]*(5/32))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[48] = "motel « dusk »";
	statBatTab[48] = (nbrCaseByKm[12]*(15/66) + nbrCaseByKm[13]*(5/32) + nbrCaseByKm[14]*(5/17) + nbrCaseByKm[15]*(5/32))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[49] = "tente d'un c.";
	statBatTab[49] = (nbrCaseByKm[12]*(9/66) + nbrCaseByKm[13]*(3/32) + nbrCaseByKm[14]*(3/17) + nbrCaseByKm[15]*(3/32))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[50] = "villa de duke";
	statBatTab[50] = (nbrCaseByKm[12]*(6/66) + nbrCaseByKm[13]*(2/32) + nbrCaseByKm[14]*(2/17) + nbrCaseByKm[15]*(2/32))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[51] = "hangars de st.";
	statBatTab[51] = (nbrCaseByKm[15]*(15/32) + nbrCaseByKm[16]*(292/3466) + nbrCaseByKm[17]*(453/2883) + nbrCaseByKm[18]*(685/3726))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[52] = "avant-poste m.";
	statBatTab[52] = (nbrCaseByKm[16]*(970/3466) + nbrCaseByKm[17]*(489/2883) + nbrCaseByKm[18]*(755/3726) + nbrCaseByKm[19]*(695/2715))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[53] = "comion « m.-m. »";
	statBatTab[53] = (nbrCaseByKm[16]*(391/3466) + nbrCaseByKm[17]*(215/2883) + nbrCaseByKm[18]*(311/3726) + nbrCaseByKm[19]*(273/2715))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[54] = "caverne a. hab.";
	statBatTab[54] = (nbrCaseByKm[16]*(943/3466) + nbrCaseByKm[17]*(478/2883) + nbrCaseByKm[18]*(731/3726) + nbrCaseByKm[19]*(698/2715))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[55] = "v. hôpital de c.";
	statBatTab[55] = (nbrCaseByKm[16]*(870/3466) + nbrCaseByKm[17]*(443/2883) + nbrCaseByKm[18]*(787/3726) + nbrCaseByKm[19]*(633/2715))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[56] = "puits ab.";
	statBatTab[56] = (nbrCaseByKm[17]*(805/2883) + nbrCaseByKm[18]*(457/3726) + nbrCaseByKm[19]*(416/2715) + nbrCaseByKm[20])*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[57] = "le bar des i. p.";
	statBatTab[57] = (nbrCaseByKm[21]*(2/8) + nbrCaseByKm[22]*(2/8) + nbrCaseByKm[23]*(2/8) + nbrCaseByKm[24]*(2/8) + nbrCaseByKm[25]*(2/8) + nbrCaseByKm[26]*(2/8) + nbrCaseByKm[27]*(2/8) + nbrCaseByKm[28]*(2/8))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[58] = "char d'a. en p.";
	statBatTab[58] = (nbrCaseByKm[21]*(5/8) + nbrCaseByKm[22]*(5/8) + nbrCaseByKm[23]*(5/8) + nbrCaseByKm[24]*(5/8) + nbrCaseByKm[25]*(5/8) + nbrCaseByKm[26]*(5/8) + nbrCaseByKm[27]*(5/8) + nbrCaseByKm[28]*(5/8))*statByCaseToHaveBatHigherThan4;
	
	nameBatTab[59] = "un é. appareil c.";
	statBatTab[59] = (nbrCaseByKm[21]*(1/8) + nbrCaseByKm[22]*(1/8) + nbrCaseByKm[23]*(1/8) + nbrCaseByKm[24]*(1/8) + nbrCaseByKm[25]*(1/8) + nbrCaseByKm[26]*(1/8) + nbrCaseByKm[27]*(1/8) + nbrCaseByKm[28]*(1/8))*statByCaseToHaveBatHigherThan4;
	
	array_multisort(statBatTab, 'SORT_DESC', 'SORT_NUMERIC', nameBatTab, 'SORT_ASC', 'SORT_STRING');
	
	var chart;

	chart = new Highcharts.Chart({
		chart: 
		{
			renderTo: 'simuBat',
			type: 'column',
			width: 810,
			height: 450,
			marginRight: 25,
			backgroundColor: '#FCFFC5',
			plotBackgroundColor: '#FCFFC5'
		},
		title: {
			text: 'Statistique de fréquence d\'apparition des batiments',
			style: {
				color: 'black'
			}
		},
		xAxis: {
			labels: {
				formatter: function() {
					return this.value; // clean, unformatted number for year
				},
				rotation : 70,
				align: 'left'
			},
			categories: nameBatTab
		},
		yAxis: {
			title: {
				text: 'Nombre',
				style: {
					color: 'black'
				}
			},
			labels: {
				formatter: function() {
					return this.value;
				}
			}
		},
		tooltip: {
			formatter: function() {
				return  this.x + ' : ' + Highcharts.numberFormat(this.y, 3) + ' %';
			}
		},
		series: [{
			name: 'Bâtiments',
			data: statBatTab,
			color: '#683F24'
		}]
	});  
}

function array_multisort (arr) {
  // +   original by: Theriault
  // *     example 1: array_multisort([1, 2, 1, 2, 1, 2], [1, 2, 3, 4, 5, 6]);
  // *     returns 1: true
  // *     example 2: characters = {A: 'Edward', B: 'Locke', C: 'Sabin', D: 'Terra', E: 'Edward'};
  // *     example 2: jobs = {A: 'Warrior', B: 'Thief', C: 'Monk', D: 'Mage', E: 'Knight'};
  // *     example 2: array_multisort(characters, 'SORT_DESC', 'SORT_STRING', jobs, 'SORT_ASC', 'SORT_STRING');
  // *     returns 2: true
  // *     results 2: characters == {D: 'Terra', C: 'Sabin', B: 'Locke', E: 'Edward', A: 'Edward'};
  // *     results 2: jobs == {D: 'Mage', C: 'Monk', B: 'Thief', E: 'Knight', A: 'Warrior'};
  // *     example 3: lastnames = [ 'Carter','Adams','Monroe','Tyler','Madison','Kennedy','Adams'];
  // *     example 3: firstnames = ['James', 'John' ,'James', 'John', 'James',  'John',   'John'];
  // *     example 3: president = [ 39,      6,      5,       10,     4,       35,        2    ];
  // *     example 3: array_multisort(firstnames, 'SORT_DESC', 'SORT_STRING', lastnames, 'SORT_ASC', 'SORT_STRING', president, 'SORT_NUMERIC');
  // *     returns 3: true
  // *     results 3: firstnames == ['John', 'John', 'John',   'John', 'James', 'James',  'James'];
  // *     results 3: lastnames ==  ['Adams','Adams','Kennedy','Tyler','Carter','Madison','Monroe'];
  // *     results 3: president ==  [2,      6,      35,       10,     39,       4,       5];
  // Fix: this function must be fixed like asort(), etc., to return a (shallow) copy by default, since IE does not support!
  // VARIABLE DESCRIPTIONS
  //
  // flags: Translation table for sort arguments. Each argument turns on certain bits in the flag byte through addition.
  //        bits:    HGFE DCBA
  //        bit A: Only turned on if SORT_NUMERIC was an argument.
  //        bit B: Only turned on if SORT_STRING was an argument.
  //        bit C: Reserved bit for SORT_ASC; not turned on.
  //        bit D: Only turned on if SORT_DESC was an argument.
  //        bit E: Turned on if either SORT_REGULAR, SORT_NUMERIC, or SORT_STRING was an argument. If already turned on, function would return FALSE like in PHP.
  //        bit F: Turned on if either SORT_ASC or SORT_DESC was an argument. If already turned on, function would return FALSE like in PHP.
  //        bit G and H: (Unused)
  //
  // sortFlag: Holds sort flag byte of every array argument.
  //
  // sortArrs: Holds the values of array arguments.
  //
  // sortKeys: Holds the keys of object arguments.
  //
  // nLastSort: Holds a copy of the current lastSort so that the lastSort is not destroyed
  //
  // nLastSort: Holds a copy of the current lastSort so that the lastSort is not destroyed
  //
  // args: Holds pointer to arguments for reassignment
  //
  // lastSort: Holds the last Javascript sort pattern to duplicate the sort for the last sortComponent.
  //
  // lastSorts: Holds the lastSort for each sortComponent to duplicate the sort of each component on each array.
  //
  // tmpArray: Holds a copy of the last sortComponent's array elements to reiterate over the array
  //
  // elIndex: Holds the index of the last sortComponent's array elements to reiterate over the array
  //
  // sortDuplicator: Function for duplicating previous sort.
  //
  // sortRegularASC: Function for sorting regular, ascending.
  //
  // sortRegularDESC: Function for sorting regular, descending.
  //
  // thingsToSort: Holds a bit that indicates which indexes in the arrays can be sorted. Updated after every array is sorted.
  var argl = arguments.length,
    sal = 0,
    flags = {
      'SORT_REGULAR': 16,
      'SORT_NUMERIC': 17,
      'SORT_STRING': 18,
      'SORT_ASC': 32,
      'SORT_DESC': 40
    },
    sortArrs = [
      []
    ],
    sortFlag = [0],
    sortKeys = [
      []
    ],
    g = 0,
    i = 0,
    j = 0,
    k = '',
    l = 0,
    thingsToSort = [],
    vkey = 0,
    zlast = null,
    args = arguments,
    nLastSort = [],
    lastSort = [],
    lastSorts = [],
    tmpArray = [],
    elIndex = 0,
    sortDuplicator = function (a, b) {
      return nLastSort.shift();
    },
    sortFunctions = [
      [function (a, b) {
        lastSort.push(a > b ? 1 : (a < b ? -1 : 0));
        return a > b ? 1 : (a < b ? -1 : 0);
      }, function (a, b) {
        lastSort.push(b > a ? 1 : (b < a ? -1 : 0));
        return b > a ? 1 : (b < a ? -1 : 0);
      }],
      [function (a, b) {
        lastSort.push(a - b);
        return a - b;
      }, function (a, b) {
        lastSort.push(b - a);
        return b - a;
      }],
      [function (a, b) {
        lastSort.push((a + '') > (b + '') ? 1 : ((a + '') < (b + '') ? -1 : 0));
        return (a + '') > (b + '') ? 1 : ((a + '') < (b + '') ? -1 : 0);
      }, function (a, b) {
        lastSort.push((b + '') > (a + '') ? 1 : ((b + '') < (a + '') ? -1 : 0));
        return (b + '') > (a + '') ? 1 : ((b + '') < (a + '') ? -1 : 0);
      }]
    ];

  // Store first argument into sortArrs and sortKeys if an Object.
  // First Argument should be either a Javascript Array or an Object, otherwise function would return FALSE like in PHP
  if (Object.prototype.toString.call(arr) === '[object Array]') {
    sortArrs[0] = arr;
  }
  else if (arr && typeof arr === 'object') {
    for (i in arr) {
      if (arr.hasOwnProperty(i)) {
        sortKeys[0].push(i);
        sortArrs[0].push(arr[i]);
      }
    }
  }
  else {
    return false;
  }


  // arrMainLength: Holds the length of the first array. All other arrays must be of equal length, otherwise function would return FALSE like in PHP
  //
  // sortComponents: Holds 2 indexes per every section of the array that can be sorted. As this is the start, the whole array can be sorted.
  var arrMainLength = sortArrs[0].length,
    sortComponents = [0, arrMainLength];

  // Loop through all other arguments, checking lengths and sort flags of arrays and adding them to the above variables.
  for (j = 1; j < argl; j++) {
    if (Object.prototype.toString.call(arguments[j]) === '[object Array]') {
      sortArrs[j] = arguments[j];
      sortFlag[j] = 0;
      if (arguments[j].length !== arrMainLength) {
        return false;
      }
    } else if (arguments[j] && typeof arguments[j] === 'object') {
      sortKeys[j] = [];
      sortArrs[j] = [];
      sortFlag[j] = 0;
      for (i in arguments[j]) {
        if (arguments[j].hasOwnProperty(i)) {
          sortKeys[j].push(i);
          sortArrs[j].push(arguments[j][i]);
        }
      }
      if (sortArrs[j].length !== arrMainLength) {
        return false;
      }
    } else if (typeof arguments[j] === 'string') {
      var lFlag = sortFlag.pop();
      if (typeof flags[arguments[j]] === 'undefined' || ((((flags[arguments[j]]) >>> 4) & (lFlag >>> 4)) > 0)) { // Keep extra parentheses around latter flags check to avoid minimization leading to CDATA closer
        return false;
      }
      sortFlag.push(lFlag + flags[arguments[j]]);
    } else {
      return false;
    }
  }


  for (i = 0; i !== arrMainLength; i++) {
    thingsToSort.push(true);
  }

  // Sort all the arrays....
  for (i in sortArrs) {
    if (sortArrs.hasOwnProperty(i)) {
      lastSorts = [];
      tmpArray = [];
      elIndex = 0;
      nLastSort = [];
      lastSort = [];

      // If ther are no sortComponents, then no more sorting is neeeded. Copy the array back to the argument.
      if (sortComponents.length === 0) {
        if (Object.prototype.toString.call(arguments[i]) === '[object Array]') {
          args[i] = sortArrs[i];
        } else {
          for (k in arguments[i]) {
            if (arguments[i].hasOwnProperty(k)) {
              delete arguments[i][k];
            }
          }
          sal = sortArrs[i].length;
          for (j = 0, vkey = 0; j < sal; j++) {
            vkey = sortKeys[i][j];
            args[i][vkey] = sortArrs[i][j];
          }
        }
        delete sortArrs[i];
        delete sortKeys[i];
        continue;
      }

      // Sort function for sorting. Either sorts asc or desc, regular/string or numeric.
      var sFunction = sortFunctions[(sortFlag[i] & 3)][((sortFlag[i] & 8) > 0) ? 1 : 0];

      // Sort current array.
      for (l = 0; l !== sortComponents.length; l += 2) {
        tmpArray = sortArrs[i].slice(sortComponents[l], sortComponents[l + 1] + 1);
        tmpArray.sort(sFunction);
        lastSorts[l] = [].concat(lastSort); // Is there a better way to copy an array in Javascript?
        elIndex = sortComponents[l];
        for (g in tmpArray) {
          if (tmpArray.hasOwnProperty(g)) {
            sortArrs[i][elIndex] = tmpArray[g];
            elIndex++;
          }
        }
      }

      // Duplicate the sorting of the current array on future arrays.
      sFunction = sortDuplicator;
      for (j in sortArrs) {
        if (sortArrs.hasOwnProperty(j)) {
          if (sortArrs[j] === sortArrs[i]) {
            continue;
          }
          for (l = 0; l !== sortComponents.length; l += 2) {
            tmpArray = sortArrs[j].slice(sortComponents[l], sortComponents[l + 1] + 1);
            nLastSort = [].concat(lastSorts[l]); // alert(l + ':' + nLastSort);
            tmpArray.sort(sFunction);
            elIndex = sortComponents[l];
            for (g in tmpArray) {
              if (tmpArray.hasOwnProperty(g)) {
                sortArrs[j][elIndex] = tmpArray[g];
                elIndex++;
              }
            }
          }
        }
      }

      // Duplicate the sorting of the current array on array keys
      for (j in sortKeys) {
        if (sortKeys.hasOwnProperty(j)) {
          for (l = 0; l !== sortComponents.length; l += 2) {
            tmpArray = sortKeys[j].slice(sortComponents[l], sortComponents[l + 1] + 1);
            nLastSort = [].concat(lastSorts[l]);
            tmpArray.sort(sFunction);
            elIndex = sortComponents[l];
            for (g in tmpArray) {
              if (tmpArray.hasOwnProperty(g)) {
                sortKeys[j][elIndex] = tmpArray[g];
                elIndex++;
              }
            }
          }
        }
      }

      // Generate the next sortComponents
      zlast = null;
      sortComponents = [];
      for (j in sortArrs[i]) {
        if (sortArrs[i].hasOwnProperty(j)) {
          if (!thingsToSort[j]) {
            if ((sortComponents.length & 1)) {
              sortComponents.push(j - 1);
            }
            zlast = null;
            continue;
          }
          if (!(sortComponents.length & 1)) {
            if (zlast !== null) {
              if (sortArrs[i][j] === zlast) {
                sortComponents.push(j - 1);
              } else {
                thingsToSort[j] = false;
              }
            }
            zlast = sortArrs[i][j];
          } else {
            if (sortArrs[i][j] !== zlast) {
              sortComponents.push(j - 1);
              zlast = sortArrs[i][j];
            }
          }
        }
      }

      if (sortComponents.length & 1) {
        sortComponents.push(j);
      }
      if (Object.prototype.toString.call(arguments[i]) === '[object Array]') {
        args[i] = sortArrs[i];
      }
      else {
        for (j in arguments[i]) {
          if (arguments[i].hasOwnProperty(j)) {
            delete arguments[i][j];
          }
        }

        sal = sortArrs[i].length;
        for (j = 0, vkey = 0; j < sal; j++) {
          vkey = sortKeys[i][j];
          args[i][vkey] = sortArrs[i][j];
        }

      }
      delete sortArrs[i];
      delete sortKeys[i];
    }
  }
  return true;
}
