///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define([
  "dojo/_base/declare",
  "jimu/BaseWidget",
  "esri/tasks/QueryTask",
  "esri/tasks/query",
  "esri/geometry/Polygon",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/graphic",
  "esri/geometry/webMercatorUtils",
  "esri/geometry/Point",
  "./utils",
], function (
  declare,
  BaseWidget,
  QueryTask,
  Query,
  Polygon,
  SFS,
  SLS,
  Graphic,
  wmUtils,
  Point,
  utils
) {
  var clazz = declare([BaseWidget], {
    events: [],

    postCreate: function () {
      this.inherited(arguments);
    },

    startup: function () {
      this.inherited(arguments);
    },

    _getMapId: function () {
      alert(this.map.id);
    },

    onOpen() {
      this.map.setInfoWindowOnClick(false);
      const clickEvent = this.map.on("click", this.onMapClick.bind(this));
      this.events.push(clickEvent);
    },

    onClose() {
      this.resetState();
    },

    selectExtremeCountries: function () {
      const queryTask = new QueryTask(
        "https://services3.arcgis.com/PVrhXRCzjs03PIMX/arcgis/rest/services/Countries_v2/FeatureServer/0"
      );

      const greenStyle = new SFS()
        .setColor("#2eff43")
        .setOutline(new SLS().setColor("#019410"));

      const redStyle = new SFS()
        .setColor("#fc5d9a")
        .setOutline(new SLS().setColor("#a30222"));

      const query = new Query();
      query.where = "NAME=SOVEREIGNT";
      query.outFields = ["NAME", "POP_EST"];
      query.returnGeometry = true;
      query.orderByFields = ["POP_EST DESC"];
      queryTask.execute(query, (result) => {
        const { features } = result;

        const max5Features = features
          .slice(0, 5)
          .map((f) => ({ ...f, populationType: "max" }));

        const min5Features = features
          .slice(-5)
          .map((f) => ({ ...f, populationType: "min" }));

        const extremeFeatures = [...max5Features, ...min5Features];

        extremeFeatures.forEach((f) => {
          const polygon = new Polygon(f.geometry);
          const style = f.populationType === "max" ? greenStyle : redStyle;
          this.map.graphics.add(new Graphic(polygon, style, f.attributes));
        });

        this.selectBtn.disabled = true;
        this.clearBtn.disabled = false;
      });
    },

    clearSelection: function () {
      this.map.graphics.clear();
      this.clearBtn.disabled = true;
      this.selectBtn.disabled = false;
    },

    resetEvents() {
      this.events.forEach((ev) => ev.remove());
      this.events = [];
    },

    resetState() {
      this.resetEvents();
      this.map.setInfoWindowOnClick(true);
    },

    destroy() {
      this.inherited(arguments);
      this.map.graphics.clear();
    },

    onMapClick(event) {
      const { mapPoint } = event;
      if (this.config.units === "wm") {
        const x = utils.round(mapPoint.x, 100);
        const y = utils.round(mapPoint.y, 100);
        this.coordBlock.innerText = `X: ${x}, Y: ${y}`;
      } else {
        const point = new Point(mapPoint);
        const latLonPoint = wmUtils.webMercatorToGeographic(point);
        const lon = utils.round(latLonPoint.x, 100);
        const lat = utils.round(latLonPoint.y, 100);
        this.coordBlock.innerText = `Lon: ${lon}, Lat: ${lat}`;
      }
    },
  });

  return clazz;
});
