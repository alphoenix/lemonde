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
            type: 'column'
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
                '2008',
                '2009',
                '2010',
                '2011'],
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
            formatter: function() {
                return '<strong>Réserve pour ' + this.x +
                    '</strong><br / >'+ Highcharts.numberFormat(this.y, 0, '.',' ') +' euros';
            },
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
            name: 'Réserve parlementaire',
            color: '#1f0d67',
            data: [93186810, 106548891, 115531265, 120869823]

        }]
    });
});