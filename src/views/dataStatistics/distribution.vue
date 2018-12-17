


<style lang="less">
    @import "../../styles/common.less";
    .num{font-size: 28px;color: red;display: block}


</style>

<template>
    <div>
        <Card>
            <div class="search-box">
                <Form ref="searchData" :model="searchData" :rules="searchValidata" inline style="display: inline-block">
                    <Select v-model="searchData.integralStatus" style="width:140px" placeholder="选择积分类型">
                        <Option v-for="item,key in integralStatus" :value="key" :key="key">{{ item }}</Option>
                    </Select>
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
                <Col span="4">发放成功(万)：<span class="num" style="color:red;">{{count.successTotalAmount}}</span></Col>
                <Col span="4">发放失败(万)：<span class="num" style="color:#c33531;">{{count.fail}}</span></Col>
                <Col span="4">待处理(万)：<span class="num" style="color:#2e4553;">{{count.waitTotalAmount}}</span></Col>

            </Row>
        </Card>
        <!--<Card style="margin-top: 30px">-->
            <!--<div class="search-box">-->
                <!--<Form ref="searchData" :model="searchData" :rules="searchValidata" inline style="display: inline-block">-->

                    <!--<FormItem prop="searchDate">-->
                        <!--<DatePicker type="daterange" v-model="searchData.searchDate" placeholder="请选择时间范围" style="width: 200px"></DatePicker>-->
                    <!--</FormItem>-->
                    <!--<Select v-model="searchData.shipStatus" style="width:140px" placeholder="选择审核状态">-->
                        <!--<Option v-for="item,key in shipStatus" :value="key" :key="key">{{ item }}</Option>-->
                    <!--</Select>-->
                    <!--<FormItem>-->
                        <!--<ButtonGroup>-->
                            <!--<Button type="primary" icon="search" @click="search()">搜索</Button>-->
                            <!--<Button @click="resetSearch">清空</Button>-->
                        <!--</ButtonGroup>-->
                    <!--</FormItem>-->
                <!--</Form>-->

            <!--</div>-->
            <!--<div id="main_shanghu" style="width: 100%;height: 400px;"></div>-->
            <!--<Row type="flex" justify="start" class="code-row-bg">-->
                <!--<Col span="4">发放成功(万)：<span class="num" style="color:red;">{{count.successTotalAmount}}</span></Col>-->
                <!--<Col span="4">发放失败(万)：<span class="num" style="color:#c33531;">{{count.fail}}</span></Col>-->
                <!--<Col span="4">待处理(万)：<span class="num" style="color:#2e4553;">{{count.waitTotalAmount}}</span></Col>-->

            <!--</Row>-->
        <!--</Card>-->
    </div>

</template>

<script>
    import Config from '../../config/config';
    import Util from '../../libs/util';
    import Cookies from 'js-cookie';
    import echarts from 'echarts'
    export default {
        name: 'distribution',
        data () {
            return {
                charts: '',
                typeEnd:"date",
                textTitle:'',
                searchData:{
                    keyword:"",
                    searchDate:[],
                    startDate:"",
                    endDate:"",
                    type:0
                },
                count: {
                    successTotalAmount: "0.00",
                    fail: "0.00",
                    waitTotalAmount: "0.00",

                },
                type_1_sum: [],
                type_2_sum: [],
                type_3_sum: [],
                type_4_sum: [],
                type_date:[],
                shipStatus:["日","月","年"],
                integralStatus:['会员积分发放','商户积分分发'],
                searchValidata: {},
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
            drawPie(id){
                this.charts = echarts.init(document.getElementById(id))
                this.charts.setOption({
                    title : {
                        text:this.textTitle,
                        // subtext: '纯属虚构'
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {

                        data:['分发成功','分发失败','等待分发']
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
                        // {
                        //     name:'银联',
                        //     type:'bar',
                        //     data:this.type_1_sum,
                        //
                        // },
                        {
                            name:'分发成功',
                            type:'line',
                            data:this.type_1_sum,

                        },
                        {
                            name:'分发失败',
                            type:'line',
                            data:this.type_2_sum,

                        },
                        {
                            name:'等待分发',
                            type:'line',
                            data:this.type_3_sum,
                        }
                        // {
                        //     name:'线下转账',
                        //     type:'bar',
                        //     data:this.type_4_sum,
                        //
                        // }
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
                    Config.showError({
                        vm:this,
                        errorMsg:"结束时间不能小于开始时间"
                    });
                }

                // this.page.pageNumber=1;
                // if(pageNumber)this.page.pageNumber=pageNumber;
                // this.doWhat("list");
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

                if(this.searchData.startDate==""&&this.searchData.endDate==""){

                }else{

                    if(this.searchData.integralStatus==1){
                        var url=Config.apiRootPath+Config.api.dataStatistics.distribution.sDw;
                    }else{
                        var url=Config.apiRootPath+Config.api.dataStatistics.distribution.dw;


                    }
                    location.href=url+"&ssid="+Cookies.get('ssid')+"&startDate="+this.searchData.startDate+"&endDate="+this.searchData.endDate;
                }


            },
            getList(){
                // console.log('a');
                let postData={
                    ssid:Cookies.get('ssid'),

                };


                if(this.searchData.keyword!="")postData.search=this.searchData.keyword;
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

                if(this.searchData.integralStatus==1){
                    this.textTitle="商户积分分发统计";
                    var url=Config.apiRootPath+Config.api.dataStatistics.distribution.slist;

                }else{
                    this.textTitle="会员积分分发统计"
                    var url=Config.apiRootPath+Config.api.dataStatistics.distribution.list;


                }
                $.ajax({
                    url:url,
                    type: 'POST',
                    dataType: 'json',
                    data: postData
                })
                    .done((data)=>{
                        this.dataReady--;
                        // getList
                        if(!!data){
                            if(data.code==0){
                                this.count.successTotalAmount=(Number(data.data.sum.successTotalAmount!=null?data.data.sum.successTotalAmount:'0.00')/10000).toFixed(8);
                                // this.count.type_1_sum=Number(data.data.sum.type_1_sum!=null?data.data.sum.type_1_sum:0)/10000;
                                this.count.fail=(Number(data.data.sum.fail!=null?data.data.sum.fail:'0.00')/10000).toFixed(8);
                                this.count.waitTotalAmount=(Number(data.data.sum.waitTotalAmount!=null?data.data.sum.waitTotalAmount:'0.00')/10000).toFixed(8);
                                // if(data.data.total>=0){
                                //     this.count.successTotalAmount=Number(data.data.sum.successTotalAmount)/10000;
                                //     // this.count.type_1_sum=Number(data.data.sum.type_1_sum!=null?data.data.sum.type_1_sum:0)/10000;
                                //     this.count.fail=Number(data.data.sum.fail!=null?data.data.sum.fail:'0.00')/10000;
                                //     this.count.failTotalAmount=Number(data.data.sum.failTotalAmount!=null?data.data.sum.failTotalAmount:'0.00')/10000;
                                //     // this.count.type_4_sum=Number(data.data.sum.type_4_sum)/10000;
                                // }else{
                                //
                                // }

                                // this.page.dataCount=data.data.count;
                                if(data.data.list==undefined){


                                }else{

                                    this.type_1_sum= [];
                                    this.type_2_sum= [];
                                    this.type_3_sum= [];

                                    this.type_date=[];
                                    for(var i=0;i<data.data.list.length;i++){
                                        // this.type_1_sum.push(data.data.list[i].type_1);
                                        this.type_1_sum.push((Number(data.data.list[i].successTotalAmount)/10000).toFixed(8));
                                        this.type_2_sum.push((Number(data.data.list[i].failTotalAmount)/10000).toFixed(8));
                                        this.type_3_sum.push((Number(data.data.list[i].waitTotalAmount)/10000).toFixed(8));
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

        },

        mounted() {

            this.getList();
            this.drawPie("mains");

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
            // this.aler();
            this.drawPie("mains");
        }
    };
</script>



