$(function () {
    Highcharts.setOptions({
        lang: {
            numericSymbols: ['', ' millions'],
            thousandsSep: ' ',
            decimalPoint: ','
        }
    });
    $('#chart2').highcharts({
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
                'Communistes et écologistes',
                'Socialistes',
                'Centristes',
                'UMP',
                'non-inscrits',
                'autres'
            ],
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
            formatter: function () {
                return '<strong>' + this.x +
                    '</strong><br />' + Highcharts.numberFormat(this.y, 2, ',', ' ') + ' euros par député';
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
            color: '#d50303',
            data: [36571.15, 39196.8051282051, 144935.833333333, 190964.490131579,79322.6153846154]

        }]
    });
});