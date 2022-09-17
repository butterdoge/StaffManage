<template>
  <div class="d-flex justify-center flex-column align-center">
    <h2 class="mt-5">数据分析报表</h2>
    <v-container class="pt-10">
      <v-row>
        <v-col cols="12" md="6">
          <div id="unit">渲染区A</div>
        </v-col>
        <v-col cols="12" md="6">
          <div id="autho">渲染区B</div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { getUserUnitData, getAuthoData } from "@/utils/api";
import * as echarts from "echarts";
export default {
  name: "dataRefer",
  mounted() {
    getUserUnitData().then((res) => {
      this.unitAnalysis = res.data;
      var chartDom = document.getElementById("unit");
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        title: {
          text: "各单位人数比重统计",
          subtext: "饼状图展示",
          left: "auto",
        },
        tooltip: {
          trigger: "item",
          formatter: "组织信息细节：<br>{b} : {c}人 ({d}%)",
        },
        series: [
          {
            type: "pie",
            data: this.dataToUsedUnit,
          },
        ],
      };
      option && myChart.setOption(option);

      
    });
    getAuthoData().then((res) => {
      this.authoAnalysis = res.data;
      var chartDom2=document.getElementById("autho");
      var myChart2 = echarts.init(chartDom2);
      var option2;
      option2 = {
        title: {
          text: "各权限组人数比重",
          subtext: "饼状图展示",
          left: "auto",
        },
        tooltip: {
          trigger: "item",
          formatter: "组织信息细节：<br>{b} : {c}人 ({d}%)",
        },
        series: [
          {
            type: "pie",
            data:  this.dataToUsedAutho
          },
        ],
      };
      option2 && myChart2.setOption(option2);
    });
    console.log("数据获取完成！");
  },
  data() {
    return {
      unitAnalysis: {},
      authoAnalysis: {},
    };
  },
  beforeRouteUpdate(to, from, next) {
    console.log(to, from, next);
    next();
  },
  computed: {
    dataToUsedUnit() {
      // 深拷贝，草。
      var arr = JSON.parse(JSON.stringify(this.unitAnalysis));
      console.log(arr);
      arr.forEach(function (item) {
        item.value = item.nums;
        delete item.nums;
        delete item.unitID;
      });
      return arr;
    },
    dataToUsedAutho(){
      var arr=JSON.parse(JSON.stringify(this.authoAnalysis));
      console.log(arr);
      arr.forEach(function(item){
        item.value=item.nums;
        item.name=item.authority;
        switch(item.name){
          case 1:
            item.name="系统管理员";
            break;
          case 2:
            item.name="单位管理员";
            break;
          case 3:
            item.name="一般人员";
            break;
        }

        delete item.nums;
        delete item.authority;
      })
      return arr;
    },
    unitNames() {
      var arr = JSON.parse(JSON.stringify(this.unitAnalysis));
      var m = arr.map((x) => {
        return x.name;
      });
      return m;
    },
  },
  methods: {},
};
</script>

<style>
#unit {
  width: 100%;
  height: 300px;
}
#autho {
  width: 100%;
  height: 300px;
}
</style>