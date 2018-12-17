


<style lang="less">
    @import "../../styles/common.less";
    .num{font-size: 28px;color: red;display: block}


</style>

<template>
    <div>
        <Card>
            <div class="search-box">
                <Form ref="searchData" :model="searchData" :rules="searchValidata" inline style="display: inline-block">

                  <!--   <FormItem prop="searchDate">
                        <DatePicker type="daterange" v-model="searchData.searchDate" placeholder="请选择时间范围" style="width: 200px"></DatePicker>
                    </FormItem> -->
                    <Select v-model="searchData.shipStatus" style="width:140px" placeholder="选择时间类型" @on-change="Onchange">
                        <Option v-for="item,key in shipStatus" :value="key" :key="key">{{ item }}</Option>
                    </Select>


                     <FormItem prop="searchDate">
                    <DatePicker v-bind:type="typeEnd" v-model="searchData.startDate" placeholder="请选择开始时间" style="width: 200px"></DatePicker>
                </FormItem>
                 <FormItem prop="searchDate">
                    <DatePicker v-bind:type="typeEnd" v-model="searchData.endDate" placeholder="请选择结束时间" style="width: 200px"></DatePicker>
                </FormItem>

                    <FormItem>
                        <ButtonGroup>
                            <Button type="primary" icon="search" @click="search()">搜索</Button>
                            <Button type="success" icon="android-download" @click="download()">导出</Button>
                            <Button @click="resetSearch">清空</Button>
                        </ButtonGroup>
                    </FormItem>
                </Form>

            </div>
            <div id="mains" style="width: 100%;height: 400px;"></div>
            <Row type="flex" justify="start" class="code-row-bg">
                <Col span="4">已反总金额(万)：<span class="num" style="color:red;">{{count.total_yes}}</span></Col>
                <Col span="4">待反总金额(万)：<span class="num" style="color:red;">{{count.total_no}}</span></Col>
                <Col span="4">已返直接分享奖励总金额(万)：<span class="num" style="color:#c33531;">{{count.type_1_sum}}</span></Col>
                <Col span="4">待返直接分享奖励总金额(万)：<span class="num" style="color:#2e4553;">{{count.type_2_sum}}</span></Col>
                <Col span="4">已返间接分享奖励总金额(万)：<span class="num" style="color: #61a0a9;">{{count.type_3_sum}}</span></Col>
                <Col span="4">待返间接分享奖励总金额(万)：<span class="num" style="color:#d38265;">{{count.type_4_sum}}</span></Col>
            </Row>
        </Card>
        <!--预购宝充值-->
        <Card style="margin-top: 30px">
            <!--<h2>购物积分统计</h2>-->
            <div class="search-box">
                <Form ref="reg_searchData" :model="reg_searchData" :rules="reg_searchValidata" inline style="display: inline-block">

                   <!--  <FormItem prop="searchDate">
                        <DatePicker type="daterange" v-model="reg_searchData.searchDate" placeholder="请选择时间范围" style="width: 200px"></DatePicker>
                    </FormItem> -->
                    <Select v-model="reg_searchData.shipStatus" style="width:140px" placeholder="选择时间类型" @on-change="reg_Onchange">
                        <Option v-for="item,key in reg_shipStatus" :value="key" :key="key">{{ item }}</Option>
                    </Select>

                     <FormItem prop="searchDate">
                        <DatePicker v-bind:type="reg_typeEnd" v-model="reg_searchData.startDate" placeholder="请选择开始时间" style="width: 200px"></DatePicker>
                    </FormItem>
                     <FormItem prop="searchDate">
                        <DatePicker v-bind:type="reg_typeEnd" v-model="reg_searchData.endDate" placeholder="请选择结束时间" style="width: 200px"></DatePicker>
                    </FormItem>
                    <FormItem>
                        <ButtonGroup>
                            <Button type="primary" icon="search" @click="reg_search()">搜索</Button>
                            <Button type="success" icon="android-download" @click="reg_download()">导出</Button>
                            <Button @click="reg_resetSearch()">清空</Button>
                        </ButtonGroup>
                    </FormItem>
                </Form>

            </div>
            <div id="main_reg" style="width: 100%;height: 400px;"></div>
            <Row type="flex" justify="start" class="code-row-bg">
                <Col span="4">已返推荐代理奖励(万)：<span class="num" style="color:#c33531;">{{reg_count.type_1_sum}}</span></Col>
                <Col span="4">待返推荐代理奖励(万)：<span class="num" style="color:#2e4553;">{{reg_count.type_2_sum}}</span></Col>
            </Row>
        </Card>

        <!--购物积分-->
        <Card style="margin-top: 30px">
            <!--<h2>购物积分统计</h2>-->
            <div class="search-box">
                <Form ref="jf_searchData" :model="jf_searchData" :rules="jf_searchValidata" inline style="display: inline-block">

                  <!--   <FormItem prop="searchDate">
                        <DatePicker type="daterange" v-model="jf_searchData.searchDate" placeholder="请选择时间范围" style="width: 200px"></DatePicker>
                    </FormItem> -->
                    <Select v-model="jf_searchData.shipStatus" style="width:140px" placeholder="选择时间类型" @on-change="jf_Onchange">
                        <Option v-for="item,key in jf_shipStatus" :value="key" :key="key">{{ item }}</Option>
                    </Select>

                     <FormItem prop="searchDate">
                        <DatePicker v-bind:type="jf_typeEnd" v-model="jf_searchData.startDate" placeholder="请选择开始时间" style="width: 200px"></DatePicker>
                    </FormItem>
                     <FormItem prop="searchDate">
                        <DatePicker v-bind:type="jf_typeEnd" v-model="jf_searchData.endDate" placeholder="请选择结束时间" style="width: 200px"></DatePicker>
                    </FormItem>
                    <FormItem>
                        <ButtonGroup>
                            <Button type="primary" icon="search" @click="jf_search()">搜索</Button>
                            <Button type="success" icon="android-download" @click="jf_download()">导出</Button>
                            <Button @click="jf_resetSearch()">清空</Button>
                        </ButtonGroup>
                    </FormItem>
                </Form>

            </div>
            <div id="main_jf" style="width: 100%;height: 400px;"></div>
            <Row type="flex" justify="start" class="code-row-bg">
                <Col span="4">总额(万)：<span class="num" style="color:red;">{{jf_count.total}}</span></Col>
                <Col span="4">分享合伙人奖励总金额(万)：<span class="num" style="color:red;">{{jf_count.type_1_sum}}</span></Col>
                <Col span="4">事业合伙人奖励总金额(万)：<span class="num" style="color:red;">{{jf_count.type_2_sum}}</span></Col>
            </Row>
        </Card>
    </div>

</template>

<script>
    import Config from '../../config/config';
    import Util from '../../libs/util';
    import Cookies from 'js-cookie';
    import echarts from 'echarts'
    export default {
        name: 'award',
        data () {
            return {
                charts: '',
                 typeEnd:'date',
                reg_typeEnd:'date',
                jf_typeEnd:'date',
                searchData:{
                    keyword:"",
                    searchDate:[],
                    startDate:"",
                    endDate:"",
                    type:0
                },
                count: {
                    total_yes: "0.00",
                    total_no: "0.00",
                    type_1_sum: "0.00",
                    type_2_sum: "0.00",
                    type_3_sum: "0.00",
                    type_4_sum: "0.00",
                },
                type_1_sum: [],
                type_2_sum: [],
                type_3_sum: [],
                type_4_sum: [],
                type_date:[],
                shipStatus:["日","月","年"],
                searchValidata: {},
                //充值类型reg
                reg_searchData:{
                    keyword:"",
                    searchDate:[],
                    startDate:"",
                    endDate:"",
                    type:0
                },
                reg_count: {
                    total: "0.00",
                    type_1_sum: "0.00",
                    type_2_sum: "0.00",
                    type_3_sum: "0.00",
                    type_4_sum: "0.00",
                },
                reg_type_1_sum: [],
                reg_type_2_sum: [],
                reg_type_3_sum: [],
                reg_type_4_sum: [],
                reg_type_date:[],
                reg_shipStatus:["日","月","年"],
                reg_searchValidata: {},
                //购物积分jf
                jf_searchData:{
                    keyword:"",
                    searchDate:[],
                    startDate:"",
                    endDate:"",
                    type:0
                },
                jf_count: {
                    total: "0.00",
                    type_1_sum: "0.00",
                    type_2_sum: "0.00",

                },
                jf_type_1_sum: [],
                jf_type_2_sum: [],

                jf_type_date:[],
                jf_shipStatus:["日","月","年"],
                jf_searchValidata: {},


            }
        },
        methods:{
             Onchange(event){

                if(event===0){
                    this.typeEnd="date";
                }else if(event==1){
                    this.typeEnd="month";

                }else{
                    this.typeEnd="year";

                }
            },
               reg_Onchange(event){

                if(event===0){
                    this.reg_typeEnd="date";
                }else if(event==1){
                    this.reg_typeEnd="month";

                }else{
                    this.reg_typeEnd="year";

                }
            },
               jf_Onchange(event){

                if(event===0){
                    this.jf_typeEnd="date";
                }else if(event==1){
                    this.jf_typeEnd="month";

                }else{
                    this.jf_typeEnd="year";

                }
            },
            drawPie(id){
                this.charts = echarts.init(document.getElementById(id))
                this.charts.setOption({
                    title : {
                        text: '分享奖励',
                        // subtext: '纯属虚构'
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {

                        data:['已返直接分享奖励','待返直接分享奖励','已返间接分享奖励','待返间接分享奖励']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : this.type_date
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'已返直接分享奖励',
                            type:'bar',
                            data:this.type_1_sum,

                        },
                        {
                            name:'待返直接分享奖励',
                            type:'bar',
                            data:this.type_2_sum,

                        },
                        {
                            name:'已返间接分享奖励',
                            type:'bar',
                            data:this.type_3_sum,

                        },
                        {
                            name:'待返间接分享奖励',
                            type:'bar',
                            data:this.type_4_sum,

                        }
                    ]
                })
            },


            reg_drawPie(id){
                this.charts = echarts.init(document.getElementById(id))
                this.charts.setOption({
                    title : {
                        text: '代理推荐奖励',
                        // subtext: '纯属虚构'
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {

                        data:['已返还金额','待返还金额']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : this.reg_type_date
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'已返还金额',
                            type:'line',
                            data:this.reg_type_1_sum,

                        },
                        {
                            name:'待返还金额',
                            type:'line',
                            data:this.reg_type_2_sum,

                        }

                    ]
                })
            },

            //积分

            jf_drawPie(id){

                this.charts = echarts.init(document.getElementById(id))
                this.charts.setOption({
                    title : {
                        text: '推荐会员奖励',
                        // subtext: '纯属虚构'
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {

                        data:['分享合伙人奖励','事业合伙人奖励']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : this.jf_type_date
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'分享合伙人奖励',
                            type:'line',
                            data:this.jf_type_1_sum,

                        },
                        {
                            name:'事业合伙人奖励',
                            type:'line',
                            data:this.jf_type_2_sum,

                        },

                    ]
                })
            },
            resetCurrentData () {
                this.currentData = $.extend(true, {}, this.defaultData);
            },

            resetSearch () {
                this.searchData={
                    keyword:"",
                    searchDate:[],
                    startDate:"",
                    endDate:"",
                    type:0
                };

            },
            reg_resetSearch () {
                this.reg_searchData={
                    keyword:"",
                    searchDate:[],
                    startDate:"",
                    endDate:"",
                    type:0
                };

            },
            jf_resetSearch () {
                this.jf_searchData={
                    keyword:"",
                    searchDate:[],
                    startDate:"",
                    endDate:"",
                    type:0
                };

            },

              search() {
                if(this.searchData.startDate<=this.searchData.endDate){
                    this.searchData.startDate=Util.FormatDate(this.searchData.startDate,"yyyy-MM-dd");
                    this.searchData.endDate=Util.FormatDate(this.searchData.endDate,"yyyy-MM-dd");
                      if(this.typeEnd=="year"){


                          this.searchData.endDate=Util.DateAdd("y ", 1, new Date(this.searchData.endDate));
                          this.searchData.endDate=Util.DateAdd("d ", 1, new Date(this.searchData.endDate));
                          this.searchData.endDate=Util.FormatDate(this.searchData.endDate,"yyyy-MM-dd");



                    }else if(this.typeEnd=="month"){
                          this.searchData.endDate=Util.DateAdd("m ", 1, new Date(this.searchData.endDate));
                          this.searchData.endDate=Util.DateAdd("d ", 1, new Date(this.searchData.endDate));
                          this.searchData.endDate=Util.FormatDate(this.searchData.endDate,"yyyy-MM-dd");

                    }else{


                    }
                    this. getList();
                }else{
                    // errorMsg:"结束时间不能小于开始时间"
                    Config.showError({
                        vm:this,
                        errorMsg:"结束时间不能小于开始时间"
                    });
                }

            },
            reg_search() {
                if(this.reg_searchData.startDate<=this.reg_searchData.endDate){
                    this.reg_searchData.startDate=Util.FormatDate(this.reg_searchData.startDate,"yyyy-MM-dd");
                    this.reg_searchData.endDate=Util.FormatDate(this.reg_searchData.endDate,"yyyy-MM-dd");
                      if(this.reg_typeEnd=="year"){


                          this.reg_searchData.endDate=Util.DateAdd("y ", 1, new Date(this.reg_searchData.endDate));
                          this.reg_searchData.endDate=Util.DateAdd("d ", 1, new Date(this.reg_searchData.endDate));
                          this.reg_searchData.endDate=Util.FormatDate(this.reg_searchData.endDate,"yyyy-MM-dd");



                    }else if(this.reg_typeEnd=="month"){
                          this.reg_searchData.endDate=Util.DateAdd("m ", 1, new Date(this.reg_searchData.endDate));
                          this.reg_searchData.endDate=Util.DateAdd("d ", 1, new Date(this.reg_searchData.endDate));
                          this.reg_searchData.endDate=Util.FormatDate(this.reg_searchData.endDate,"yyyy-MM-dd");

                    }else{


                    }
                    this.reg_getList();
                }else{
                    // errorMsg:"结束时间不能小于开始时间"
                    Config.showError({
                        vm:this,
                        errorMsg:"结束时间不能小于开始时间"
                    });

                }

            },
            jf_search() {
                if(this.jf_searchData.startDate<=this.jf_searchData.endDate){
                    this.jf_searchData.startDate=Util.FormatDate(this.jf_searchData.startDate,"yyyy-MM-dd");
                    this.jf_searchData.endDate=Util.FormatDate(this.jf_searchData.endDate,"yyyy-MM-dd");
                     if(this.jf_typeEnd=="year"){


                          this.jf_searchData.endDate=Util.DateAdd("y ", 1, new Date(this.jf_searchData.endDate));
                          this.jf_searchData.endDate=Util.DateAdd("d ", 1, new Date(this.jf_searchData.endDate));
                          this.jf_searchData.endDate=Util.FormatDate(this.jf_searchData.endDate,"yyyy-MM-dd");



                    }else if(this.jf_typeEnd=="month"){
                          this.jf_searchData.endDate=Util.DateAdd("m ", 1, new Date(this.jf_searchData.endDate));
                          this.jf_searchData.endDate=Util.DateAdd("d ", 1, new Date(this.jf_searchData.endDate));
                          this.jf_searchData.endDate=Util.FormatDate(this.jf_searchData.endDate,"yyyy-MM-dd");

                    }else{


                    }
                    this. jf_getList();
                }else{

                    // errorMsg:"结束时间不能小于开始时间"
                    Config.showError({
                        vm:this,
                        errorMsg:"结束时间不能小于开始时间"
                    });


                }

            },

            //会员下载
            download(){
                if(this.searchData.startDate==""&&this.searchData.endDate==""){
                    Config.showError({
                        vm:this,
                        errorMsg:"时间不能为空"
                    });
                }else{
                    if(this.searchData.startDate<= this.searchData.endDate){
                        this.searchData.startDate=Util.FormatDate(this.searchData.startDate,"yyyy-MM-dd");
                        this.searchData.endDate=Util.FormatDate(this.searchData.endDate,"yyyy-MM-dd");
                        if(this.typeEnd=="year"){
                            this.searchData.endDate=Util.DateAdd("y ", 1, new Date(this.searchData.endDate));
                            this.searchData.endDate=Util.DateAdd("d ", 1, new Date(this.searchData.endDate));
                            this.searchData.endDate=Util.FormatDate(this.searchData.endDate,"yyyy-MM-dd");
                        }else if(this.typeEnd=="month"){
                            this.searchData.endDate=Util.DateAdd("m ", 1, new Date(this.searchData.endDate));
                            this.searchData.endDate=Util.DateAdd("d ", 1, new Date(this.searchData.endDate));
                            this.searchData.endDate=Util.FormatDate(this.searchData.endDate,"yyyy-MM-dd");

                        }else{


                        }
                        this. downloadlist();
                    }else{
                        Config.showError({
                            vm:this,
                            errorMsg:"结束时间不能小于开始时间"
                        });
                    }
                }

            },
            //导出
            downloadlist(){
                if(this.searchData.startDate!=""){
                    this.searchData.startDate=this.searchData.startDate;
                }else{
                    var date = new Date();
                    var y = date.getFullYear();  //获取年

                    var m = date.getMonth() + 1;  //获取月

                    m = m < 10 ? '0' + m : m;  //判断月是否大于10

                    var d = date.getDate();  //获取日

                    d = d < 10 ? ('0' + d) : d;  //判断日期是否大10
                    this.searchData.startDate = y + '-' + m + '-' + "01";
                }

                if(this.searchData.endDate!=""){

                    this.searchData.endDate=this.searchData.endDate;
                }else {
                    var date = new Date();
                    var y = date.getFullYear();  //获取年

                    var m = date.getMonth() + 1;  //获取月

                    m = m < 10 ? '0' + m : m;  //判断月是否大于10

                    var d = date.getDate();  //获取日

                    d = d < 10 ? ('0' + d) : d;  //判断日期是否大10


                    this.searchData.endDate =y + '-' + m + '-' + d;
                }
                let url=Config.apiRootPath+Config.api.dataStatistics.award.regDw;
                if(this.searchData.startDate==""&&this.searchData.endDate==""){

                }else{
                    location.href=url+"&ssid="+Cookies.get('ssid')+"&startDate="+this.searchData.startDate+"&endDate="+this.searchData.endDate;
                }


            },

            //代理推荐奖励明导出
            reg_download(){
                if(this.reg_searchData.startDate==""&&this.reg_searchData.endDate==""){
                    Config.showError({
                        vm:this,
                        errorMsg:"时间不能为空"
                    });
                }else{
                    if(this.reg_searchData.startDate<= this.reg_searchData.endDate){
                        this.reg_searchData.startDate=Util.FormatDate(this.reg_searchData.startDate,"yyyy-MM-dd");
                        this.reg_searchData.endDate=Util.FormatDate(this.reg_searchData.endDate,"yyyy-MM-dd");
                        if(this.typeEnd=="year"){
                            this.reg_searchData.endDate=Util.DateAdd("y ", 1, new Date(this.reg_searchData.endDate));
                            this.reg_searchData.endDate=Util.DateAdd("d ", 1, new Date(this.reg_searchData.endDate));
                            this.reg_searchData.endDate=Util.FormatDate(this.reg_searchData.endDate,"yyyy-MM-dd");

                        }else if(this.typeEnd=="month"){
                            this.reg_searchData.endDate=Util.DateAdd("m ", 1, new Date(this.reg_searchData.endDate));
                            this.reg_searchData.endDate=Util.DateAdd("d ", 1, new Date(this.reg_searchData.endDate));
                            this.reg_searchData.endDate=Util.FormatDate(this.reg_searchData.endDate,"yyyy-MM-dd");

                        }else{


                        }
                        this. reg_downloadlist();
                    }else{
                        Config.showError({
                            vm:this,
                            errorMsg:"结束时间不能小于开始时间"
                        });
                    }
                }

            },


            //导出
            reg_downloadlist(){
                if(this.reg_searchData.startDate!=""){
                    this.reg_searchData.startDate=this.reg_searchData.startDate;
                }else{
                    var date = new Date();
                    var y = date.getFullYear();  //获取年

                    var m = date.getMonth() + 1;  //获取月

                    m = m < 10 ? '0' + m : m;  //判断月是否大于10

                    var d = date.getDate();  //获取日

                    d = d < 10 ? ('0' + d) : d;  //判断日期是否大10
                    this.reg_searchData.startDate = y + '-' + m + '-' + "01";
                }

                if(this.reg_searchData.endDate!=""){

                    this.reg_searchData.endDate=this.reg_searchData.endDate;
                }else {
                    var date = new Date();
                    var y = date.getFullYear();  //获取年
                    var m = date.getMonth() + 1;  //获取月
                    m = m < 10 ? '0' + m : m;  //判断月是否大于10
                    var d = date.getDate();  //获取日
                    d = d < 10 ? ('0' + d) : d;  //判断日期是否大10
                    this.reg_searchData.endDate =y + '-' + m + '-' + d;
                }
                let url=Config.apiRootPath+Config.api.dataStatistics.award.listDw;
                if(this.reg_searchData.startDate==""&&this.reg_searchData.endDate==""){

                }else{
                    location.href=url+"&ssid="+Cookies.get('ssid')+"&startDate="+this.reg_searchData.startDate+"&endDate="+this.reg_searchData.endDate;
                }
            },

            //代理推荐奖励明导出
            jf_download(){
                if(this.jf_searchData.startDate==""&&this.jf_searchData.endDate==""){
                    Config.showError({
                        vm:this,
                        errorMsg:"时间不能为空"
                    });
                }else{
                    if(this.jf_searchData.startDate<= this.jf_searchData.endDate){
                        this.jf_searchData.startDate=Util.FormatDate(this.jf_searchData.startDate,"yyyy-MM-dd");
                        this.jf_searchData.endDate=Util.FormatDate(this.jf_searchData.endDate,"yyyy-MM-dd");
                        if(this.typeEnd=="year"){
                            this.jf_searchData.endDate=Util.DateAdd("y ", 1, new Date(this.jf_searchData.endDate));
                            this.jf_searchData.endDate=Util.DateAdd("d ", 1, new Date(this.jf_searchData.endDate));
                            this.jf_searchData.endDate=Util.FormatDate(this.jf_searchData.endDate,"yyyy-MM-dd");

                        }else if(this.typeEnd=="month"){
                            this.jf_searchData.endDate=Util.DateAdd("m ", 1, new Date(this.jf_searchData.endDate));
                            this.jf_searchData.endDate=Util.DateAdd("d ", 1, new Date(this.jf_searchData.endDate));
                            this.jf_searchData.endDate=Util.FormatDate(this.jf_searchData.endDate,"yyyy-MM-dd");

                        }else{


                        }
                        this. jf_downloadlist();
                    }else{
                        Config.showError({
                            vm:this,
                            errorMsg:"结束时间不能小于开始时间"
                        });
                    }
                }

            },


            //导出
            jf_downloadlist(){
                if(this.jf_searchData.startDate!=""){
                    this.jf_searchData.startDate=this.jf_searchData.startDate;
                }else{
                    var date = new Date();
                    var y = date.getFullYear();  //获取年

                    var m = date.getMonth() + 1;  //获取月

                    m = m < 10 ? '0' + m : m;  //判断月是否大于10

                    var d = date.getDate();  //获取日

                    d = d < 10 ? ('0' + d) : d;  //判断日期是否大10
                    this.jf_searchData.startDate = y + '-' + m + '-' + "01";
                }

                if(this.jf_searchData.endDate!=""){

                    this.jf_searchData.endDate=this.jf_searchData.endDate;
                }else {
                    var date = new Date();
                    var y = date.getFullYear();  //获取年
                    var m = date.getMonth() + 1;  //获取月
                    m = m < 10 ? '0' + m : m;  //判断月是否大于10
                    var d = date.getDate();  //获取日
                    d = d < 10 ? ('0' + d) : d;  //判断日期是否大10
                    this.jf_searchData.endDate =y + '-' + m + '-' + d;
                }
                let url=Config.apiRootPath+Config.api.dataStatistics.award.jfDw;
                if(this.jf_searchData.startDate==""&&this.jf_searchData.endDate==""){

                }else{
                    location.href=url+"&ssid="+Cookies.get('ssid')+"&startDate="+this.jf_searchData.startDate+"&endDate="+this.jf_searchData.endDate;
                }
            },
            getList(){
                let postData={
                    ssid:Cookies.get('ssid'),

                };
                if(this.searchData.keyword!="")postData.search=Util.trim(this.searchData.keyword);
                if(this.searchData.startDate!=""){
                    postData.startDate=this.searchData.startDate;
                }else{
                    var date = new Date();
                    var y = date.getFullYear();  //获取年

                    var m = date.getMonth() + 1;  //获取月

                    m = m < 10 ? '0' + m : m;  //判断月是否大于10

                    var d = date.getDate();  //获取日

                    d = d < 10 ? ('0' + d) : d;  //判断日期是否大10
                    postData.startDate = y + '-' + m + '-' + "01";
                }
                if(this.searchData.shipStatus>=0){
                    postData.type=this.searchData.shipStatus+1;
                }else{
                    postData.type=1;
                }
                if(this.searchData.endDate!=""){

                    postData.endDate=this.searchData.endDate;
                }else {
                    var date = new Date();
                    var y = date.getFullYear();  //获取年

                    var m = date.getMonth() + 1;  //获取月

                    m = m < 10 ? '0' + m : m;  //判断月是否大于10

                    var d = date.getDate();  //获取日

                    d = d < 10 ? ('0' + d) : d;  //判断日期是否大10


                    postData.endDate =y + '-' + m + '-' + d;
                }

                $.ajax({
                    url: Config.apiRootPath+Config.api.dataStatistics.award.list,
                    type: 'POST',
                    dataType: 'json',
                    data: postData
                })
                    .done((data)=>{
                        this.dataReady--;
                        // getList
                        if(!!data){
                            if(data.code==0){

                                    this.count.total_yes=(Number(data.data.sum.total_shopping_yes!=null?data.data.sum.total_shopping_yes:"0.00")/10000).toFixed(8);
                                    this.count.total_no=(Number(data.data.sum.total_shopping_no!=null?data.data.sum.total_shopping_no:"0.00")/10000).toFixed(8);
                                    this.count.type_1_sum=(Number(data.data.sum.direct_shopping_yes!=null?data.data.sum.direct_shopping_yes:"0.00")/10000).toFixed(8);
                                    this.count.type_2_sum=(Number(data.data.sum.direct_shopping_no!=null?data.data.sum.direct_shopping_no:'0.00')/10000).toFixed(8);
                                    this.count.type_3_sum=(Number(data.data.sum.indirect_shopping_yes!=null?data.data.sum.indirect_shopping_yes:'0.00')/10000).toFixed(8);
                                    this.count.type_4_sum=(Number(data.data.sum.indirect_shopping_no!=null?data.data.sum.indirect_shopping_no:"0.00")/10000).toFixed(8);


                                // this.page.dataCount=data.data.count;
                                if(data.data.list==undefined){


                                }else{

                                    this.type_2_sum= [];
                                    this. type_3_sum= [];
                                    this.type_date=[];
                                    for(var i=0;i<data.data.list.length;i++){
                                        this.type_1_sum.push((Number(data.data.list[i].direct_shopping_yes)/10000).toFixed(8));
                                        this.type_2_sum.push((Number(data.data.list[i].direct_shopping_no)/10000).toFixed(8));
                                        this.type_3_sum.push((Number(data.data.list[i].indirect_shopping_yes)/10000).toFixed(8));
                                        this.type_4_sum.push((Number(data.data.list[i].indirect_shopping_no)/10000).toFixed(8));
                                        this.type_date.push(data.data.list[i].date)
                                    }

                                    this.drawPie("mains");
                                }




                                //format list data
                                this.tableData=data.data.list;
                            }else{
                                Config.showError({vm:this,data:data,
                                    errorMsg:""
                                });
                            }
                        }else{
                            Config.showError({vm:this,data:data,
                                errorMsg:"请求失败"
                            });
                        }
                    })
                    .fail((xhr,status,error)=>{
                        this.dataReady--;
                        Config.showError({vm:this,
                            errorMsg:"服务器通讯失败"
                        });
                    });

            },
            reg_getList(){
                let postData={
                    ssid:Cookies.get('ssid'),

                };
                if(this.reg_searchData.keyword!="")postData.search=this.reg_searchData.keyword;
                if(this.reg_searchData.startDate!=""){
                    postData.startDate=this.reg_searchData.startDate;
                }else{
                    var date = new Date();
                    var y = date.getFullYear();  //获取年

                    var m = date.getMonth() + 1;  //获取月

                    m = m < 10 ? '0' + m : m;  //判断月是否大于10

                    var d = date.getDate();  //获取日

                    d = d < 10 ? ('0' + d) : d;  //判断日期是否大10
                    postData.startDate = y + '-' + m + '-' + "01";
                }
                if(this.reg_searchData.shipStatus>=0){
                    postData.type=this.reg_searchData.shipStatus+1;
                }else{
                    postData.type=1;
                }
                if(this.reg_searchData.endDate!=""){

                    postData.endDate=this.reg_searchData.endDate;
                }else {
                    var date = new Date();
                    var y = date.getFullYear();  //获取年

                    var m = date.getMonth() + 1;  //获取月

                    m = m < 10 ? '0' + m : m;  //判断月是否大于10

                    var d = date.getDate();  //获取日

                    d = d < 10 ? ('0' + d) : d;  //判断日期是否大10


                    postData.endDate =y + '-' + m + '-' + d;
                }

                $.ajax({
                    url: Config.apiRootPath+Config.api.dataStatistics.award.reg,
                    type: 'POST',
                    dataType: 'json',
                    data: postData
                })
                    .done((data)=>{
                        this.dataReady--;
                        // getList
                        if(!!data){
                            if(data.code==0){

                                    // this.reg_count.total=Number(data.data.total!=null?data.data.total:'0.00')/10000;
                                    this.reg_count.type_1_sum=(Number(data.data.sum.direct_shopping_yes!=null?data.data.sum.direct_shopping_yes:'0.00')/10000).toFixed(8);
                                    this.reg_count.type_2_sum=(Number(data.data.sum.direct_shopping_no!=null?data.data.sum.direct_shopping_no:'0.00')/10000).toFixed(8);
                                    // this.reg_count.type_3_sum=Number(data.data.sum.type_3_sum!=null?data.data.sum.type_3_sum:'0.00')/10000;
                                    // this.reg_count.type_4_sum=Number(data.data.sum.type_4_sum!=null?data.data.sum.type_4_sum:'0.00')/10000;

                                // this.page.dataCount=data.data.count;
                                if(data.data.list==undefined){


                                }else{

                                    this.reg_type_1_sum= [];
                                    this.reg_type_2_sum= [];
                                    // this.reg_type_3_sum= [];
                                    // this.reg_type_4_sum= [];
                                    this.reg_type_date=[];
                                    for(var i=0;i<data.data.list.length;i++){
                                        this.reg_type_1_sum.push((Number(data.data.list[i].direct_shopping_yes)/10000).toFixed(8));
                                        this.reg_type_2_sum.push((Number(data.data.list[i].direct_shopping_no)/10000).toFixed(8));
                                        // this.reg_type_3_sum.push(data.data.list[i].type_3);
                                        // this.reg_type_4_sum.push(data.data.list[i].type_4);
                                        this.reg_type_date.push(data.data.list[i].date)
                                    }

                                    this.reg_drawPie("main_reg");
                                }




                                //format list data
                                this.tableData=data.data.list;
                            }else{
                                Config.showError({vm:this,data:data,
                                    errorMsg:""
                                });
                            }
                        }else{
                            Config.showError({vm:this,data:data,
                                errorMsg:"请求失败"
                            });
                        }
                    })
                    .fail((xhr,status,error)=>{
                        this.dataReady--;
                        Config.showError({vm:this,
                            errorMsg:"服务器通讯失败"
                        });
                    });

            },

            jf_getList(){
                let postData={
                    ssid:Cookies.get('ssid'),

                };
                if(this.jf_searchData.keyword!="")postData.search=this.jf_searchData.keyword;
                if(this.jf_searchData.startDate!=""){
                    postData.startDate=this.jf_searchData.startDate;
                }else{
                    var date = new Date();
                    var y = date.getFullYear();  //获取年

                    var m = date.getMonth() + 1;  //获取月

                    m = m < 10 ? '0' + m : m;  //判断月是否大于10

                    var d = date.getDate();  //获取日

                    d = d < 10 ? ('0' + d) : d;  //判断日期是否大10
                    postData.startDate = y + '-' + m + '-' + "01";
                }
                if(this.jf_searchData.shipStatus>=0){
                    postData.type=this.jf_searchData.shipStatus+1;
                }else{
                    postData.type=1;
                }
                if(this.jf_searchData.endDate!=""){

                    postData.endDate=this.jf_searchData.endDate;
                }else {
                    var date = new Date();
                    var y = date.getFullYear();  //获取年

                    var m = date.getMonth() + 1;  //获取月

                    m = m < 10 ? '0' + m : m;  //判断月是否大于10

                    var d = date.getDate();  //获取日

                    d = d < 10 ? ('0' + d) : d;  //判断日期是否大10


                    postData.endDate =y + '-' + m + '-' + d;
                }

                $.ajax({
                    url: Config.apiRootPath+Config.api.dataStatistics.award.jf,
                    type: 'POST',
                    dataType: 'json',
                    data: postData
                })
                    .done((data)=>{
                        this.dataReady--;
                        // getList
                        if(!!data){
                            if(data.code==0){

                                    this.jf_count.total=(Number(data.data.sum.amount!=null?data.data.sum.amount:"0.00")/10000/100).toFixed(6);
                                    this.jf_count.type_1_sum=(Number(data.data.sum.share_amount!=null?data.data.sum.share_amount:'0.00')/10000/100).toFixed(6);
                                    this.jf_count.type_2_sum=(Number(data.data.sum.cause_amount!=null?data.data.sum.cause_amount:'0.00')/10000/100).toFixed(6);

                                    // this.count.type_4_sum=Number(data.data.sum.type_4_sum)/10000;


                                // this.page.dataCount=data.data.count;
                                if(data.data.list==undefined){


                                }else{

                                    this.jf_type_1_sum= [];
                                    // this. jf_type_2_sum= [];
                                    this.jf_type_date=[];
                                    for(var i=0;i<data.data.list.length;i++){
                                        // this.type_1_sum.push(data.data.list[i].type_1);
                                        this.jf_type_1_sum.push((Number(data.data.list[i].amount)/10000/100).toFixed(6));
                                        this.jf_type_1_sum.push((Number(data.data.list[i].share_amount)/10000/100).toFixed(6));
                                        this.jf_type_2_sum.push((Number(data.data.list[i].cause_amount)/10000/100).toFixed(6));
                                        this.jf_type_date.push(data.data.list[i].date)
                                    }

                                    this.jf_drawPie("main_jf");
                                }




                                //format list data
                                this.tableData=data.data.list;
                            }else{
                                Config.showError({vm:this,data:data,
                                    errorMsg:""
                                });
                            }
                        }else{
                            Config.showError({vm:this,data:data,
                                errorMsg:"请求失败"
                            });
                        }
                    })
                    .fail((xhr,status,error)=>{
                        this.dataReady--;
                        Config.showError({vm:this,
                            errorMsg:"服务器通讯失败"
                        });
                    });

            },

        },

        mounted() {

            this.getList();
            this.reg_getList();
            this.jf_getList();

            // this.drawPie("mains");
            // this.jf_drawPie("mains_jf");
            // this.reg_drawPie("mains_reg");

        },
        /*  activated(){
           // this.drawPie('mains');
           // this.getList()
       },
       computed(){
           // this.getList()
       },
*/

        activated (){
            // this.drawPie("mains");
        }
    };
</script>



