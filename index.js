const NUMBEO_URL = 'https://cors-anywhere.herokuapp.com/https://www.numbeo.com/api/city_prices?api_key=sx4z80hb0fuss2&query=';
var dataset1=[],dataset2=[], cityNameOne, cityNameTwo,detailsCostofLiving=[],i=0,j=0, cityImageOne,cityImageTwo;

function getCityName(){
    $.each(cityNamesWithCodes, function (index, value) {
        $('#cityNameOne').append('<option value="' + value.City + '">');
        $('#cityNameTWo').append('<option value="' + value.City + '">');
    });
};
getCityName();
function getCostOfLivingApiData(cityName,callBack){
    $.getJSON(NUMBEO_URL + cityName, callBack);
};
function filterData(result,cityName) {
    let totalcostofliving=0;
    cityNameArray=result.name.toString().split(',');
    cityName=cityNameArray[0]+','+cityNameArray[1];
    $.each(result.prices, function( index, value ) {
        if (value.item_id==2 || value.item_id==26 || value.item_id==30) {
            totalcostofliving=Math.round(totalcostofliving+value.average_price);
            detailsCostofLiving.push(Math.round(value.average_price));
        }
    });
    $('#result1 .textBottom').append(dispalyResultDom(totalcostofliving,cityName));
    dataset1[i]=totalcostofliving;
    i++;
};
function dispalyResultDom(totalcostofliving, cityName) {
    return `
		<p> ${cityName} : $<span>${totalcostofliving}</span></p>
	`
};
function getHousePricessApiData(cityCode,callBack){
    $.getJSON('https://cors.io/?https://www.quandl.com/api/v3/datasets/ZILLOW/C'+cityCode+'_ZRISFRR?api_key=hzmgKTSmvyCcncCbDGtd',callBack);
};
function filterData2(result) {
    let cityName= result.dataset.name.toString().split('-')[3];
    let cityData= result.dataset.data[0][1];
    $('#result2 .textBottom').append(dispalyResultDom2(cityName, cityData));
    dataset2[j]=cityData;
    j++;
};
function dispalyResultDom2(cityName, cityData) {
    return `
		<p> ${cityName} : $<span>${cityData}</span></p>
	`
};
// try to break this down ......................
function formSubmission() {
    $('#form').submit(function(e) {
        e.preventDefault();
        $.ajaxSetup({
            async: false
        });
        $('#result1 .textBottom').html('');
        $('#result2 .textBottom').html('');
        cityNameOne= $('.cityNameOne').val();
        cityNameTwo= $('.cityNameTwo').val();
        if ( cityNameOne.length === 0 || cityNameTwo.length === 0 ){
            alert('Sorry! You can not compare an empty field. Please try again!');
            return cityNameOne;
        };
        $('.cityNameOne').val('');
        $('.cityNameTwo').val('');
        i=0,j=0;
        cityCodeOne=0;
        cityCodeTwo=0
        $.each(cityNamesWithCodes, function( index, value ) {
            if (cityNameOne===value.City) {cityCodeOne=value.Code; cityImageOne=value.image;}
            if (cityNameTwo===value.City) {cityCodeTwo=value.Code; cityImageTwo=value.image;}
        });
        $('#result1 img').attr("src", cityImageOne);
        $('#result2 img').attr("src", cityImageTwo);
        $('#result1 .cityImage p').text(cityNameOne);
        $('#result2 .cityImage p').text(cityNameTwo);
        getHousePricessApiData(cityCodeOne,filterData2);
        getHousePricessApiData(cityCodeTwo,filterData2);
        getCostOfLivingApiData(cityNameOne,filterData);
        getCostOfLivingApiData(cityNameTwo,filterData);
        let temp=dataset1[1];
        dataset1[1]=dataset2[0];
        dataset2[0]=temp;
        showGraph(dataset1,dataset2);
        showPieChart([cityNameOne,cityNameTwo],detailsCostofLiving);
    });
};
function showGraph(dataset1, dataset2 ) {
    var barChartData = {
        labels: ['Rent Prices','Cost of Living'],
        datasets: [{
            label: cityNameOne,
            backgroundColor: ["#C21460","#99ff9e"],
            data: dataset1
        }, {
            label: cityNameTwo,
            backgroundColor: ["#C21460","#C21460"],
            data: dataset2
        }]
    };
    var ctx =$("#myChart");
    ctx.height = 500;
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
};
function showPieChart(cityName,dataArray){
    var costParameter=["Meal Cost", "Apartment Cost", "Utilities cost"];
    var fcv=[],k=0;
    fcv[0]=[dataArray[0],dataArray[3]];
    fcv[1]=[dataArray[1],dataArray[4]];
    fcv[2]=[dataArray[2],dataArray[5]];
    $.each(costParameter, function( index, value ) {
        console.log(value);
        var pieConfig = {
            labels: cityName,
            datasets: [{
                label: "Dollars",
                backgroundColor: ["#C21460", "#FB9902"],
                data: fcv[k]
            }]
        };
        var ctxpie = $("#pieChart"+k);
        var mypie = new Chart(ctxpie, {
            type: 'pie',
            data: pieConfig,
            options: {
                title: {
                    display: true,
                    text: 'Cost of Living for : ' + value
                }
            }
        });
        k++;
    });

};
$(formSubmission);
