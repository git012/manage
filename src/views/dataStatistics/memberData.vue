


<style lang="less">
    @import "../../styles/common.less";
    .num{font-size: 28px;color: red;display: block}


</style>

<template>
    <div>
        <Card>
            <div class="search-box">
                <Form ref="searchData" :model="searchData" :rules="searchValidata" inline style="display: inline-block">
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
                <Col span="4">总金额(万)：<span class="num" style="color:red;">{{count.total}}</span></Col>


                <Col span="4">分享合伙人(万)：<span class="num" style="color:#c33531;">{{count.type_2_sum}}</span></Col>
                <Col span="4">事业合伙人(万)：<span class="num" style="color:#2e4553;">{{count.type_3_sum}}</span></Col>

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
        name: 'recharge',
        data () {
            return {
                charts: '',
                typeEnd:"date",
                searchData:{
                    keyword:"",
                    searchDate:[],
                    startDate:"",
                    endDate:"",
                    type:0
                },
                count: {
                    total: "0.00",
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
            drawPie(id){
                this.charts = echarts.init(document.getElementById(id))
                this.charts.setOption({
                    title : {
                        text: '会员升级费用统计',
                        // subtext: '纯属虚构'
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {

                        data:['分享合伙人','事业合伙人']
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
                            name:'分享合伙人',
                            type:'bar',
                            data:this.type_2_sum,

                        },
                        {
                            name:'事业合伙人',
                            type:'bar',
                            data:this.type_3_sum,

                        },
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

            },
            //下载
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
                let url=Config.apiRootPath+Config.api.dataStatistics.agentcost.dw;
                if(this.searchData.startDate==""&&this.searchData.endDate==""){

                }else{
                    location.href=url+"&ssid="+Cookies.get('ssid')+"&startDate="+this.searchData.startDate+"&endDate="+this.searchData.endDate;
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
                    url: Config.apiRootPath+Config.api.dataStatistics.memberData.list,
                    type: 'POST',
                    dataType: 'json',
                    data: postData
                })
                    .done((data)=>{
                        this.dataReady--;
                        // getList
                        if(!!data){
                            if(data.code==0){
                                if(data.data.total>=0){
                                    this.count.total=(Number(data.data.total)/10000/100).toFixed(6);
                                    // this.count.type_1_sum=Number(data.data.sum.type_1_sum!=null?data.data.sum.type_1_sum:0)/10000;
                                    this.count.type_2_sum=(Number(data.data.sum.level_1_sum!=null?data.data.sum.level_1_sum:'0.00')/10000/100).toFixed(6);
                                    this.count.type_3_sum=(Number(data.data.sum.level_2_sum!=null?data.data.sum.level_2_sum:'0.00')/10000/100).toFixed(6);
                                    // this.count.type_4_sum=Number(data.data.sum.type_4_sum)/10000;
                                }else{

                                }

                                // this.page.dataCount=data.data.count;
                                if(data.data.list==undefined){


                                }else{

                                    this.type_2_sum= [];
                                    this. type_3_sum= [];
                                    this.type_date=[];
                                    for(var i=0;i<data.data.list.length;i++){
                                        // this.type_1_sum.push(data.data.list[i].type_1);
                                        this.type_2_sum.push((Number(data.data.list[i].level_1)/100/10000).toFixed(6));
                                        this.type_3_sum.push((Number(data.data.list[i].level_2)/100/10000).toFixed(6));

                                        // this.type_4_sum.push(data.data.list[i].type_4);
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

        mounted(){

            this.getList();


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
        // computed(){
        //
        // },

        activated (){
            // this.drawPie("mains");
        }
    };
</script>



