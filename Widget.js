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
  "esri/graphic",
], function (declare, BaseWidget, QueryTask, Query, Polygon, SFS, Graphic) {
  var clazz = declare([BaseWidget], {
    eventHandlers: [],

    postCreate: function () {
      this.inherited(arguments);
    },

    startup: function () {
      this.inherited(arguments);
    },

    onOpen: function () {
      console.log(this.map);
      const eventHandler = this.map.on("click", (e) => {
        const { x, y } = e.mapPoint;
        console.log("click on map");
        this.coordBlock.innerText = `X: ${x}, Y: ${y}`;
      });
      this.eventHandlers.push(eventHandler);
    },

    onClose: function () {
      this.eventHandlers.forEach((evh) => evh.remove());
    },

    _getMapId: function () {
      alert(this.map.id);
    },

    selectTopCountries: function () {
      const queryTask = new QueryTask(
        "https://services3.arcgis.com/PVrhXRCzjs03PIMX/arcgis/rest/services/Countries_v2/FeatureServer/0"
      );

      const query = new Query();
      query.where = "1=1";
      query.outFields = ["NAME", "POP_EST"];
      query.returnGeometry = true;
      query.orderByFields = ["POP_EST DESC"];
      queryTask.execute(query, (result) => {
        const { features } = result;
        const top5Features = features.slice(0, 4);
        top5Features.forEach((f) => {
          const polygon = new Polygon(f.geometry);
          this.map.graphics.add(new Graphic(polygon, new SFS(), f.attributes));
        });
      });
    },
  });
  return clazz;
});
