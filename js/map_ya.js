ymaps.modules.define('DeliveryCalculator', ['util.defineClass'], function (provide, defineClass) {
    function DeliveryCalculator(map) {
        this._map = map;
        this._startPoint = null;
        this._route = null;
        this._startPointBalloonContent;
        this._finishPointBalloonContent;
        map.events.add('click', this._onClick, this);
    }
    defineClass(DeliveryCalculator, {
        setStartPoint: function (position) {
            if (this._startPoint) {
                this._startPoint.geometry.setCoordinates(position);
            } else {
                this._startPoint = new ymaps.Placemark(position, {
                    iconContent: 'А'
                }, {
                    draggable: true
                });
                this._startPoint.events.add('dragend', this._onStartDragEnd, this);
                this._map.geoObjects.add(this._startPoint);
            }
            this.geocode('start', position);
        },
        setFinishPoint: function (position) {
            if (this._finishPoint) {
                this._finishPoint.geometry.setCoordinates(position);
            } else {
                this._finishPoint = new ymaps.Placemark(position, {
                    iconContent: 'Б'
                }, {
                    draggable: true
                });
                this._finishPoint.events.add('dragend', this._onFinishDragEnd, this);
                this._map.geoObjects.add(this._finishPoint);
            }
            if (this._startPoint) {
                this.geocode('finish', position);
            }
        },
        geocode: function (pointType, point) {
            ymaps.geocode(point).then(function (result) {
                if (pointType == 'start') {
                    this._startPointBalloonContent = result.geoObjects.get(0) && result.geoObjects.get(0).properties.get('balloonContentBody') || '';
                } else {
                    this._finishPointBalloonContent = result.geoObjects.get(0) && result.geoObjects.get(0).properties.get('balloonContentBody') || '';
                }
                this._setupRoute();
            }, this);
        },
        calculate: function (routeLength) {
            var DELIVERY_TARIF = 20,
                MINIMUM_COST = 500;
            return Math.max(routeLength * DELIVERY_TARIF, MINIMUM_COST);
        },
        _setupRoute: function () {
            if (this._route) {
                this._map.geoObjects.remove(this._route);
            }
            if (this._startPoint && this._finishPoint) {
                var start = this._startPoint.geometry.getCoordinates(),
                    finish = this._finishPoint.geometry.getCoordinates(),
                    startBalloon = this._startPointBalloonContent,
                    finishBalloon = this._finishPointBalloonContent;
                ymaps.route([start, finish]).then(function (router) {
                    var distance = Math.round(router.getLength() / 1000),
                        message = '<span>Расстояние: ' + distance + ' км.</span>';
                    document.getElementById("cp_km").value = distance;
                    calc();
                    this._route = router.getPaths();
                    this._route.options.set({
                        strokeWidth: 5,
                        strokeColor: '0000ffff',
                        opacity: 0.5
                    });
                    this._map.geoObjects.add(this._route);
                    this._startPoint.properties.set('balloonContentBody', startBalloon + message.replace('%s', this.calculate(distance)));
                    this._finishPoint.properties.set('balloonContentBody', finishBalloon + message.replace('%s', this.calculate(distance)));
                    this._finishPoint.balloon.open();
                }, this);
                this._map.setBounds(this._map.geoObjects.getBounds());
            }
        },
        _onClick: function (event) {
            if (this._startPoint) {
                this.setFinishPoint(event.get('coords'));
            } else {
                this.setStartPoint(event.get('coords'));
            }
        },
        _onStartDragEnd: function () {
            this.geocode('start', this._startPoint.geometry.getCoordinates());
        },
        _onFinishDragEnd: function () {
            this.geocode('finish', this._finishPoint.geometry.getCoordinates());
        }
    });
    provide(DeliveryCalculator);
});
ymaps.ready(['DeliveryCalculator']).then(function init() {
    var p1;
    var myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 9,
            type: 'yandex#map',
            controls: ['fullscreenControl', 'zoomControl']
        }),
        searchStartPoint = new ymaps.control.SearchControl({
            options: {
                useMapBounds: true,
                noPlacemark: true,
                noPopup: true,
                placeholderContent: 'Адрес начальной точки',
                size: 'large'
            }
        }),
        searchFinishPoint = new ymaps.control.SearchControl({
            options: {
                useMapBounds: true,
                noCentering: true,
                noPopup: true,
                noPlacemark: true,
                placeholderContent: 'Адрес конечной точки',
                size: 'large',
                float: 'none',
                position: {
                    left: 10,
                    top: 44
                }
            }
        }),
        calculator = new ymaps.DeliveryCalculator(myMap);
    myMap.controls.add(searchStartPoint);
    myMap.controls.add(searchFinishPoint);
    searchStartPoint.events.add('resultselect', function (e) {
        var results = searchStartPoint.getResultsArray(),
            selected = e.get('index'),
            point = results[selected].geometry.getCoordinates();
        calculator.setStartPoint(point);
        p1 = point;
        var resA = searchStartPoint.getRequestString(point);
        document.getElementById("Acoo").value = point;
        document.getElementById("Atxt").value = resA;
    }).add('load', function (event) {
        if (!event.get('skip') && searchStartPoint.getResultsCount()) {
            searchStartPoint.showResult(0);
        }
    });
    searchFinishPoint.events.add('resultselect', function (e) {
        var results = searchFinishPoint.getResultsArray(),
            selected = e.get('index'),
            point = results[selected].geometry.getCoordinates();
        calculator.setFinishPoint(point);
        var resB = searchFinishPoint.getRequestString(point);
        document.getElementById("Bcoo").value = point;
        document.getElementById("Btxt").value = resB;
    }).add('load', function (event) {
        if (!event.get('skip') && searchFinishPoint.getResultsCount()) {
            searchFinishPoint.showResult(0);
        }
    });
    myMap.events.add('click', function (e) {
        var coords = e.get('coords');
        KooXY = [coords[0].toPrecision(8), coords[1].toPrecision(8)].join(', ');
        var myGeocoder = ymaps.geocode(coords);
        myGeocoder.then(function (res) {
            var nearest = res.geoObjects.get(0);
            var name = nearest.properties.get('text');
            if (document.getElementById("Azadana").value == 'Нет') {
                document.getElementById("Acoo").value = KooXY;
                document.getElementById("Atxt").value = name;
                document.getElementById("Azadana").value = 'Да';
            } else {
                document.getElementById("Bcoo").value = KooXY;
                document.getElementById("Btxt").value = name;
                document.getElementById("Azadana").value = 'да'
            }
        });
    });
    myMap.events.add('contextmenu', function (e) {
        myMap.hint.open(e.get('coords'));
    });
});