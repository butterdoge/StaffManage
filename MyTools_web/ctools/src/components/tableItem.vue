<template>
  <v-container class="pt-5">
    <v-row align-content="" justify="space-between">
        <v-column cols="12" md="2" >
            创建用户：{{tableInfo.username}}
        </v-column>
        <v-column cols="12" md="3">
            表格名称：{{tableInfo.tableName}}
        </v-column>
        <v-column cols="12" md="3">
            表格描述：{{tableInfo.tableDescription}}
        </v-column>
        <v-column cols="12" md="2">
            隶属单位: {{tableInfo.unitName}}
        </v-column>
        <v-column cols="12" md="2">
            <v-btn @click="forMoreDetail">查看内容</v-btn>
        </v-column>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "table-item",
  props: ["tableInfo"],
  data() {
    return {

    };
  },
  methods: {
    forMoreDetail(){
        this.$emit("tableDetail",this.tableInfo.sheetContent)
    }
  },
};
</script>
