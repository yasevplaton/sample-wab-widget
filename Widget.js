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
define(["dojo/_base/declare", "jimu/BaseWidget"], function (
  declare,
  BaseWidget
) {
  var clazz = declare([BaseWidget], {
    baseClass: "jimu-test-best-widget",
    postCreate: function () {
      this.inherited(arguments);
      this.userLink.setAttribute("href", this.config.link);
    },

    startup: function () {
      this.inherited(arguments);
    },

    _getMapId: function () {
      alert(this.map.id);
    },

    onOpen() {
      console.log("open");
    },

    onClose() {
      console.log("close");
    },
  });
  return clazz;
});
