$(function () {
	Highcharts.setOptions({
		lang: {
			numericSymbols: [' thousands', ' millions'],
			thousandsSep: ' ',
			decimalPoint: ','
		}
	});
    $('#chart1').highcharts({
        chart: {
            backgroundColor: 'transparent',
            type: 'bar'
        },
        credits: {
            enabled: false,
        },
        title: {
            text: '',
        },
        subtitle: {
            text: '',
        },
        xAxis: {
            categories: [
                'plus de 40 ans',
                'entre 30 et 40 ans',
                'entre 20 et 30 ans',
                'entre 10 et 20 ans',
                'moins de 10 ans'],
            labels: {
                style: {
                    fontFamily: 'Arial',
                    color: '#16212c'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            },
            labels: {
                valueSuffix: 'euros',
                style: {
                    fontFamily: 'Arial',
                    color: '#16212c'
                }
            }
        },
        tooltip: {
			enabled: false,
			style: {
                    fontFamily: 'Arial',
                    color: '#16212c'
                }
        },
        legend: {
            enabled: false,
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Centrales',
            color: '#B30000',
            data: [18, 131, 183, 45, 33]

        }]
    });
});