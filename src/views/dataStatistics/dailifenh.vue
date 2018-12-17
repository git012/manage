


<style lang="less">
    @import "../../styles/common.less";
    .num{font-size: 28px;color: red;display: block}
</style>

<template>
    <div>
        <Card>
            <div class="search-box">
                <Form ref="searchData" :model="searchData" :rules="searchValidata" inline style="display: inline-block">

                    <FormItem prop="searchDate">
                        <DatePicker v-bind:type="typeEnd" v-model="searchData.startDate" placeholder="请选择开始时间" style="width: 200px"></DatePicker>
                    </FormItem>
                    <FormItem prop="searchDate">
                        <DatePicker v-bind:type="typeEnd" v-model="searchData.endDate" placeholder="请选择结束时间" style="width: 200px"></DatePicker>
                    </FormItem>
                    <FormItem label="地址：" prop="merchantProvinceId" style="width: 500px">
                        <div style="display:inline-block;width:140px;">
                            <Select v-model="currentData.merchantProvinceId" placeholder="请选择省份" @on-change="setCity">
                                <Option v-if="item" v-for="item in areaData.province" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </div>
                        <div style="display:inline-block;width:140px;">
                            <Select v-if="areaData.citys.length&&currentData.merchantProvinceId" placeholder="请选择城市" v-model="currentData.merchantCityId" @on-change="setDistrict">
                                <Option v-if="item" v-for="item in areaData.citys" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </div>
                        <div style="display:inline-block;width:140px;">
                            <Select v-if="areaData.district.length&&currentData.merchantCityId" placeholder="请选择区县" v-model="currentData.merchantDistrictId">
                                <Option v-if="item" v-for="item in areaData.district" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </div>
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

            <Row type="flex" justify="start" class="code-row-bg">
                <Col span="4">账号：<span class="num" style="color:#c33531;">{{agent_name}}</span></Col>
                <Col span="4">总积分(万)：<span class="num" style="color:#c33531;">{{total_score}}</span></Col>
                <Col span="4">代理公司积分(万)：<span class="num" style="color:#c33531;">{{agent_score}}</span></Col>
                <Col span="4">股东积分(万)：<span class="num" style="color:#c33531;">{{member_score}}</span></Col>
                <Col span="4">BD积分(万)：<span class="num" style="color:#c33531;">{{bd_member_score}}</span></Col>

            </Row>
        </Card>
    </div>

</template>

<script>
    import Config from '../../config/config';
    import Util from '../../libs/util';
    import Cookies from 'js-cookie';

    export default {
        name: 'dailifenh',
        data () {
            return {

                typeEnd:'date',
                currentData: {
                    merchantProvinceId:"27",
                    merchantCityId:"288",
                    merchantDistrictId:"2515",
                },
                defaultData:{

                    merchantProvinceId:"27",
                    merchantCityId:"288",
                    merchantDistrictId:"2515",

                },

                searchData:{
                    keyword:"",
                    searchDate:[],
                    startDate:"",
                    endDate:"",
                    type:0
                },
                areaData:{
                    areaDataReady:3,
                    province:[],
                    citys:[],
                    district:[]
                },

               agent_name:'----',
               total_score:'',
               agent_score:'',
               member_score:'',
               bd_member_score:'',
               new_merchant_count:'',
                shipStatus:["日","月","年"],
                searchValidata: {},
            }
        },
        methods:{
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
            setProvince () {
                $.ajax({
                    url: Config.apiRootPath+Config.api.public.getProvince,
                    type: 'POST',
                    dataType: 'json',
                    data: { ssid:Cookies.get('ssid') }
                }).done((data)=>{
                    // getBankCardList
                    if(!!data){
                        if(data.code==0){
                            let typelist=[];
                            for (let item in data.data){
                                typelist[parseInt(data.data[item].id)]={
                                    id : data.data[item].id,
                                    name : data.data[item].name
                                };
                            }
                            this.areaData.province=typelist;
                        }
                    }
                });
            },
            setCity (provinceId,dataReset) {
                if(!provinceId)return;
                if(!dataReset){
                    this.currentData.merchantCityId="";
                    this.currentData.merchantDistrictId="";
                }
                this.areaData.citys=[];
                this.areaData.district=[];
                $.ajax({
                    url: Config.apiRootPath+Config.api.public.getCity,
                    type: 'POST',
                    dataType: 'json',
                    data: { ssid:Cookies.get('ssid') , pid : provinceId }
                }).done((data)=>{
                    // getBankCardList
                    if(!!data){
                        if(data.code==0){
                            let typelist=[];
                            for (let item in data.data){
                                typelist[parseInt(data.data[item].id)]={
                                    id : data.data[item].id,
                                    name : data.data[item].name,
                                    pid : data.data[item].pid
                                };
                            }
                            this.areaData.citys=typelist;
                        }
                    }
                });
            },
            setDistrict (cityId,dataReset) {
                if(!cityId)return;
                this.areaData.district=[];
                if(!dataReset){
                    this.currentData.merchantDistrictId="";
                }
                $.ajax({
                    url: Config.apiRootPath+Config.api.public.getDistrict,
                    type: 'POST',
                    dataType: 'json',
                    data: { ssid:Cookies.get('ssid') ,  cid : cityId }
                }).done((data)=>{
                    // getBankCardList
                    if(!!data){
                        if(data.code==0){
                            let typelist=[];
                            for (let item in data.data){
                                typelist[parseInt(data.data[item].id)]={
                                    id : data.data[item].id,
                                    name : data.data[item].name,
                                    cid : data.data[item].cid
                                };
                            }
                            this.areaData.district=typelist;
                        }
                    }
                });
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
                    this.getList();
                }else{
                    // errorMsg:"结束时间不能小于开始时间"
                    Config.showError({
                        vm:this,
                        errorMsg:"结束时间不能小于开始时间"
                    });
                }

                // this.page.pageNumber=1;
                // if(pageNumber)this.page.pageNumber=pageNumber;
                // this.doWhat("list");
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
                let url=Config.apiRootPath+Config.api.dataStatistics.dailifenh.dw;
                if(this.searchData.startDate==""&&this.searchData.endDate==""){

                }else{
                    location.href=url+"&ssid="+Cookies.get('ssid')+"&startDate="+this.searchData.startDate+"&endDate="+this.searchData.endDate+"&district_id="+this.currentData.merchantDistrictId;
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
                if(this.currentData.merchantCityId!="")postData.city_id=this.currentData.merchantCityId;
                if(this.currentData.merchantDistrictId!="")postData.district_id=this.currentData.merchantDistrictId;
                if(this.currentData.merchantProvinceId!="")postData.province_id=this.currentData.merchantProvinceId;

                $.ajax({
                    url:Config.apiRootPath+Config.api.dataStatistics.dailifenh.list,
                    type: 'POST',
                    dataType: 'json',
                    data: postData
                })
                    .done((data)=>{
                        this.dataReady--;
                        // getList
                        if(!!data){
                            if(data.code==0){

                                this.agent_name=data.data.agent_name;
                                this.total_score=(Number(data.data.total_score)/10000).toFixed(6);
                                this.agent_score=(Number(data.data.agent_score)/10000).toFixed(6);
                                this.member_score=(Number(data.data.member_score)/10000).toFixed(6);
                                this.bd_member_score=(Number(data.data.bd_member_score)/10000).toFixed(6);

                            }else{
                                Config.showError({
                                    vm:this,
                                    errorMsg:""
                                });
                            }
                        }else{
                            Config.showError({
                                vm:this,
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
            this.setProvince();
            this.getList();


        },


        activated (){
            // this.aler();

        }
    };
</script>



