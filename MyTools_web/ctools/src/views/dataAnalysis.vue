<template>
  <div class="d-flex flex-column align-center justify-center">
    <h2 class="mt-5">数据管理与检索</h2>

    <v-container id="upload">
      <h3>表格上传区：</h3>
      <input type="file" @change="showFile($event)" />
      <v-form>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="addedSheet.tableName"
              :counter="10"
              label="表格名称"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="addedSheet.description"
              :counter="10"
              label="表格描述"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn @click="sendFile">上传表格</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>

    <v-container>
      <h3>单位表格检索区</h3>
      <table-item
        v-for="item in sheets"
        :tableInfo="item"
        :key="item.label"
        @tableDetail="handleDetail"
      >
      </table-item>
    </v-container>

    <v-container id="showTable">
      <h3>表格预览:</h3>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th
                v-for="item in Object.keys(currentWorkSheet[0])"
                :key="item.label"
              >
                {{ item }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in currentWorkSheet" :key="item.label">
              <!-- 默认遍历的是对象的值 -->
              <td v-for="itemIn in item" :key="itemIn.label">{{ itemIn }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-btn @click=exportedFile>表格导出</v-btn>
    </v-container>
  </div>
</template>

<script>
import { sendSheet, getSheets } from "@/utils/api";
import XLSX from "xlsx";
import tableItem from "@/components/tableItem";
export default {
  components: {
    "table-item": tableItem,
  },
  name: "memberManage",
  mounted() {
    getSheets().then((res) => {
      this.sheets = res.data;
    });
  },
  data() {
    return {
      blue: 1,
      currentWorkSheet: [],
      sheets: [],
      addedSheet: {
        sheetUnit: this.$store.state.userInfo.unitID,
        createrID: this.$store.state.userInfo.userID,
      },
    };
  },
  beforeRouteUpdate(to, from, next) {
    console.log(to, from, next);
    next();
  },
  methods: {
    handleDetail(TableDetail) {
      this.currentWorkSheet = JSON.parse(TableDetail);
    },
    sendFile() {
      sendSheet(this.addedSheet);
    },
    exportedFile() {
      // 将文件导出。
      var item=this.currentWorkSheet;
      var sheet = XLSX.utils.json_to_sheet(item);
      this.openDownloadDialog(this.sheet2blob(sheet));
    },
    // 可以读取文件并且解析成json
    showFile(event) {
      var rABS = true;
      // Whether to read as binaryString
      let file = event.target.files;
      //get target xml file
      let f = file[0];

      //read the file
      var reader = new FileReader();
      reader.onload = this.readerHandler;
      if (rABS) reader.readAsBinaryString(f);
      // 调用这个函数的时候会触发上面那个事件处理器。
    },
    readerHandler(e) {
      var rABS = true;
      var data = e.target.result;
      //在result内含有数据，不过这边的e是什么。
      // if(!rABS) data=new Unit8Array(data);
      // 不是以流形式实现的时候就需要再放到数组里，这里是rABS和rAAS的区别。（一个数组，一个流）

      // 然后以指定形式读取这个xlsx
      var workbook = XLSX.read(data, { type: rABS ? "binary" : "array" });
      var first_sheet_name = workbook.SheetNames[0];
      console.log(`表格的名称为${first_sheet_name}`);
      var worksheet = workbook.Sheets[first_sheet_name];
      var desired_cell = worksheet["A1"];
      console.log(`A1的位置单元格为${desired_cell}`);
      var SheetJson = XLSX.utils.sheet_to_json(worksheet);
      console.log(`工作表的json信息如下`);
      console.log(SheetJson);
      this.currentWorkSheet = SheetJson;
      this.addedSheet.sheetContent = JSON.stringify(SheetJson);
      console.log("黑人问号");
      alert("你已经成功上传一条信息文件，请填写相关信息后点击上传表格提交。");
    },
    // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
    sheet2blob(sheet, sheetName) {
      // 可选参数，设置导出表格的名称
      sheetName = sheetName || "sheet1";
      //创造workbook对象
      var workbook = {
        SheetNames: [sheetName],
        Sheets: {},
      };
      //创建对应表格。
      workbook.Sheets[sheetName] = sheet; // 生成excel的配置项

      var wopts = {
        bookType: "xlsx", // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: "binary",
      };

      // 基于选项写出成文件
      var wbout = XLSX.write(workbook, wopts);

      //转为ArrayBuffer对象，再转为Blob对象。
      var blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream",
      }); 
      
      // 字符串转ArrayBuffer
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }

      // 最终需要导出的文件。
      return blob;
    },

    openDownloadDialog(url, saveName) {
      if (typeof url == "object" && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
      }

      var aLink = document.createElement("a");
      aLink.href = url;
      aLink.download = saveName || ""; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
      var event;
      if (window.MouseEvent) event = new MouseEvent("click");
      else {
        event = document.createEvent("MouseEvents");
        event.initMouseEvent(
          "click",
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
      }
      aLink.dispatchEvent(event);
    },

    // 读取json，在页面上渲染开来

    // 将json信息发送到服务端，然后服务端保存该json。
  },
};
</script>

<style>
</style>