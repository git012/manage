/*评论管理*/


<style lang="less">
    /*@import './merchant/merchant.less';*/
    /*.page-box{padding-top: 16px; text-align: center }*/
    /*.add-btu{ position: relative; float: right}*/
    /*.ivu-card-head p.hasButtonP{ overflow:visible;}*/
    /*.doBox{ position:relative}*/
    /*.small_table .ivu-table-cell{ padding-left:8px; padding-right: 8px}*/
    /*.small_table table th{ text-align:center}*/
    /*.shop-ewm{ position: absolute; right:0px; top:0px;width:180px; text-align: center;font-size:12px}*/
    /*.shop-ewm img{width:180px; height: auto; border:1px solid #dededf}*/
</style>

<template>
    <div>
        <Card>

            <div class="doBox">
                <Spin size="large" fix v-if="switching"></Spin>
                <div class="ordler-list" v-if="doType=='list'">
                <Row>
                <Col span="11">
                    <div class="search-box">
                        <Form ref="searchData" :model="searchData" inline>
                        	<FormItem prop="keyword">
                                <Input type="text" v-model="searchData.keyword" placeholder="输入名称或者帐号搜索商户">
                                    <Icon type="ios-eye" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <!--<Select v-model="searchData.type" style="width:90px" placeholder="选择审核状态">
                                <Option v-for="item,key in recordType" :value="key" :key="key">{{ item }}</Option>
                            </Select>-->
                            <FormItem>
                                <ButtonGroup>
                                    <Button type="primary" icon="search" @click="search()">搜索</Button>
                                    <Button @click="resetSearch">清空</Button>
                                </ButtonGroup>
                            </FormItem>
                        </Form>
                    </div>
                </Col>
                <Col span="13">
                    <div class="buttonGroup">
 							<Button type="primary" :loading="loadBut" style="margin: 10px 0 10px" @click="batchOperation()" >批量审核</Button>
                    </div>
                </Col>
            </Row>
                    <Table class="small_table" border :columns="columns" :loading="getLoading" :data="tableData" @on-select="OnSelect" @on-select-all="allOnSelect" @on-selection-change="selectionchange"></Table>

                    <div class="page-box">
                        <Page v-if="page.dataCount>10" :total="page.dataCount" :current="page.pageNumber" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
                    </div>
                </div>
            </div>
            <Modal v-model="updateStatus" :closable='false' :mask-closable=false :width="500">
                <h3 slot="header" style="color:#2D8CF0">商品审核</h3>
                <Form ref="updateStatusForm" :model="updateStatusForm" :label-width="100" label-position="right" :rules="updateStatusValidate">
                    <FormItem label="商户名称：" style="margin-bottom:0px">
                        {{updateStatusForm.name}}
                    </FormItem>
                    <FormItem label="商品名称：" style="margin-bottom:0px">
                        {{updateStatusForm.pname}}
                    </FormItem>
                    <FormItem label="评论内容：" style="margin-bottom:0px">
                        {{updateStatusForm.text}}
                    </FormItem>
                    <FormItem label="回复内容：" style="margin-bottom:0px">
                        {{updateStatusForm.reply}}
                    </FormItem>


                    <FormItem label="审核状态：" prop="status">
                        <RadioGroup v-model="updateStatusForm.status">
                            <Radio label="1" v-if="updateStatusForm.status==0">
                                <span>显示</span>
                            </Radio>
                            <Radio label="0" v-if="updateStatusForm.status==1">
                                <span>隐藏</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="text" @click="cancelUpdateStatus">取消</Button>
                    <Button type="primary" :loading="saveUpdateStatusLoading" @click="saveUpdateStatus">保存</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>

<script>
    import Config from '../../config/config';
    import Util from '../../libs/util';
    import Cookies from 'js-cookie';
    import MD5 from '../../libs/md5';

    export default {
        name: 'Reviewmanagement',
        data () {
            const valideCashStatus = (rule, value, callback) => {
                if (value==0||value==1) {
                    callback();
                } else {
                    callback(new Error(rule.message));
                }
            };
            return {
                // tableOptions:{
                //     width:"100%"
                // },
                columns: [
                    {
                        type: 'selection',
                        // width: 60,
                        align: 'center'
                    },
                    {
                        title: '序号',
                        width: 60,
                        align:'center',
                        key: 'id'
                    },
                    {
                        title: '商品名称',
                        // width: "12%",
                        key: 'pname'
                    },
                    {
                        title:' 买家名称',
                        width: 130,
                        key:'name',
                    },
                    {
                        title: '商户名称',
                        // width: "15%",
                        key: 'mt_name'
                    },
                    {
                        title: '评论时间',
                        width: 130,

                        // width: "12%",
                        key: 'date_added'
                    },
                    {
                        title: '评论内容',
                        // width: "12%",
                        key: 'text'
                    },

                    {
                        title:'商家回复',
                        // width:100,
                        key:'reply',
                    },
                    {
                        title:'商家回复时间',
                        width: 100,
                        align:'center',
                        key:'update_time',
                    },

                    {
                        title: '状态',
                        key: 'status',
                        // width: "100",
                        align: 'center',
                        render: (h, params) => {

                            let tagcolor="default";
                            let tagText="";
                            if(params.row.status==0){
                                tagcolor="#ff3300";tagText="隐藏";
                            };
                            if(params.row.status==1){
                                tagcolor="#00cc66";tagText="显示";
                            };
                            // if(params.row.status==2){
                            //     tagcolor="red";tagText="失败";
                            // };
                            return h('span', {
                                style: {
                                    color: tagcolor
                                }
                            }, tagText);

                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 110,
                        align: 'center',
                        render: (h, params) => {
                            let deleteButton=h('Button', {
                                props: {

                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("review",params.index)
                                    }
                                }
                            }, '隐藏');
                            let eButton=h('Button', {
                                props: {

                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat("review",params.index)
                                    }
                                }
                            }, '显示');
                            let dobutton=[];


                            if(params.row.status==1){
                                dobutton.push(deleteButton);

                            };
                            if(params.row.status==0){
                                dobutton.push(eButton);

                            };

                            return h('div', dobutton);
                        }
                    }
                ],
                saveType: "new",
                doType:"list",
                switching:false,
                tableData: [],
                merchantTypeData: [],
                areaData:{
                    areaDataReady:3,
                    province:[],
                    citys:[],
                    district:[]
                },
                shipStatus:["待审核","审核成功","审核失败"],
                Totals :{
                    wait: "0.00",
                    fail: '0.00',
                    success: '0.00',
                    sum_total:'0.00'
                },
                page: {
                    dataCount:0,
                    pageCount:0,
                    pageSize: 10,
                    pageNumber: 1,
                    pageSizeOpts:[10,20,50,100]
                },
                dataReady:0,
                currentData: {},
                defaultData:{
                    "id": 8,
                    "merchant_id": 1,
                    "merchant_name": "",
                    "bank_id": 1111,
                    "total": "1.0000",
                    "status": 0,
                    "comment": "",
                    "date_added": "2017-11-16 16:00:20",
                    "bank_name": "",
                    "bank_number": ""
                },
                updateStatusForm: {},
                updateStatusValidate: {
                    status: [
                        { validator: valideCashStatus, message: '请选择审核结果', trigger: 'blur' }
                    ]
                },
                oldPassError: '',
                allSelect:[],
                loadBut:false,
                updateStatus: false, // 修改密码模态框显示
                saveUpdateStatusLoading: false,
                searchData:{
                    keyword:"",
                    searchDate:[],
                    startDate:"",
                    endDate:"",
                    type:""
                },
                searchValidata: {}
            };
        },
        computed : {
            getLoading () {
                return !(this.dataReady==0);
            },
            areaDataReady () {
                return !(this.areaData.areaDataReady==0);
            },
            doName () {
                if (this.doType=="list") return "商户基本信息管理";
                if (this.doType=="edit") return "编辑商户";
                if (this.doType=="add") return "添加商户";
                return "商户详情";
            },
            currentDataValidate () {
                if(this.doType=="add")return this.addDataValidate;
                return this.editDataValidate;
            },
            hasDataChange () {
                return !(JSON.stringify(this.currentData)==JSON.stringify(this.tableData[this.currentData.listIndex]));
            }
        },
        methods: {
            changePage (pageNumber){
                this.page.pageNumber=pageNumber;
                this.search(pageNumber);
            },
            changePageSize (pageSize){
                this.page.pageSize=pageSize;
                this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
                this.search();
            },

            OnSelect(event){
                 this.allSelect=event;
            },
            selectionchange(event){
                 //console.log(event);
            },
            allOnSelect(event){
                 console.log(event);
                this.allSelect=event
            },
            //controller
            checkPower (dotype) {
                return !!this.$store.state.Rights[Config.api.management.Reviewmanagement[dotype].MD5()];
            },
            doWhat (dotype,dataIndex) {
                if(!this.checkPower(dotype)){
                    this.$Message.warning("对不起，您没有此操作权限！");
                    return;
                }
                this.switching=true;
                if(dotype=="add"){
                    this.resetCurrentData();
                    this.doType="add";
                };
                if(dotype=="edit"){
                    this.showEdit(dataIndex);
                    this.doType="edit";
                };
                if(dotype=="delete"){
                    this.delete(dataIndex);
                };
                if(dotype=="review"){
                    this.changeStatus(dataIndex);
                };
                if(dotype=="list"){
                    this.resetCurrentData();
                    this.dataReady+=1;
                    this.init();
                    this.doType="list";
                };
                this.switching=false;
            },
            view (index) {
                this.currentData=$.extend(true, {}, this.tableData[index]);
                this.doType="view";
            },
            showEdit (index) {
                this.currentData=$.extend(true, {}, this.tableData[index]);
                this.currentData.userewm=Config.apiRootPath+Config.api.public.ewm+"&merchantId="+this.currentData.merchantId;
                this.setCity(this.currentData.merchantProvinceId,true);
                this.setDistrict(this.currentData.merchantCityId,true);
                this.doType="edit";
            },
            //comm
            resetCurrentData () {
                this.currentData = $.extend(true, {}, this.defaultData);
            },
            search (pageNumber) {
                if(this.searchData.searchDate.length){
                    this.searchData.startDate=Util.FormatDate(this.searchData.searchDate[0],"yyyy-MM-dd");
                    this.searchData.endDate=Util.FormatDate(this.searchData.searchDate[1],"yyyy-MM-dd");
                }
                this.page.pageNumber=1;
                if(pageNumber)this.page.pageNumber=pageNumber;
                this.doWhat("list");
            },
            //list
            resetSearch () {
                this.searchData={
                    keyword:"",
                    searchDate:[],
                    startDate:"",
                    endDate:"",
                    type:0
                };
                this.page.pageNumber=1;
                this.dataReady+=1;
                this.init();
            },
            init () {
                this.getList();
            },
            getList () {
                let postData={
                    ssid:Cookies.get('ssid'),
                    page:this.page.pageNumber,
                    pageSize:this.page.pageSize
                };
                if(this.searchData.keyword!="")postData.search=Util.trim(this.searchData.keyword);
                 if(this.searchData.type!="")postData.search=Util.trim(this.searchData.type);
                if(this.searchData.startDate!="")postData.startDate=this.searchData.startDate;
                if(this.searchData.shipStatus>=0)postData.status=this.searchData.shipStatus;
                if(this.searchData.endDate!="")postData.endDate=this.searchData.endDate;
                $.ajax({
                    url: Config.apiRootPath+Config.api.management.Reviewmanagement.list,
                    type: 'POST',
                    dataType: 'json',
                    data: postData
                })
                    .done((data)=>{
                        this.dataReady--;
                        // getList
                        if(!!data){
                            if(data.code==0){

                                this.page.dataCount=data.data.count;
                                if(data.data.sum_list==undefined){

                                }else{
                                    this.Totals.fail=data.data.sum_list.reject_total==null?"0.00":Number(data.data.sum_list.reject_total)/100;
                                    this.Totals.wait=Number(data.data.sum_list.unreviewed_total)/100;
                                    this.Totals.success=Number(data.data.sum_list.consent_total)/100;
                                    this.Totals.sum_total=Number(data.data.sum_list.sum_total)/100;
                                }



                                this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
                                //format list data
                                for(var i=0;i<data.data.list.length;i++){
                                    data.data.list[i].text=decodeURI(data.data.list[i].text);
                                }
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

            //批量操作
            batchOperation(){
            	if(this.allSelect.length>0){
                let postData=[];
                let postDatas={};
                for (var i=0;i<this.allSelect.length;i++){
                    if(this.allSelect[i].status==0){
                        this.allSelect[i].status=1
                    }else{
                        this.allSelect[i].status=0;
                    }
                    // // console.log(this.allSelect[i].status);
                    // postDatas.id=this.allSelect[i].id;
                    // postDatas.status=this.allSelect[i].status;
                    postData.push({'id':this.allSelect[i].id,'status':this.allSelect[i].status});
                } ;
                let listData={
                    data:postData
                }
                let data={
                    ssid:Cookies.get('ssid'),
                    data:JSON.stringify(listData)
                };

                $.ajax({
                    url: Config.apiRootPath+Config.api.management.Reviewmanagement.review,
                    type: 'POST',
                    dataType: 'json',
                    data: data
                })
                    .done((data)=>{

                        //userTypeList
                        if(!!data){
                            if(data.code==0){
                                this.$Message.success("操作成功！");
                                let newListData=$.extend(true, [], this.tableData);
                                newListData[this.updateStatusForm.tableIndex]=this.updateStatusForm;
                                this.updateStatusForm={};
                                this.tableData=newListData;
                                this.updateStatus = false;
                                this.doWhat("list");
                                this.allSelect={};
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

                        Config.showError({vm:this,data:data,
                            errorMsg:"服务器通讯失败"
                        });
                    });
            	}else{
            		  Config.showError({vm:this,errorMsg:"请先勾选要审核的评论！"});
            	}
            },
            //edit password
            changeStatus (index) {
                this.updateStatusForm=$.extend(true, {}, this.tableData[index]);
                this.updateStatusForm.tableIndex=index;
                this.updateStatus = true;
            },
            handleSelectAll(status){
                this.$refs.selection.selectAll(status);
            },
            cancelUpdateStatus () {
                this.updateStatusForm={};
                this.updateStatus = false;
            },
            saveUpdateStatus (index) {
                this.$refs['updateStatusForm'].validate((valid) => {
                    if (valid) {

                        this.saveUpdateStatusLoading = true;
                        let postData=[];

                        let postDatas={
                            id:this.updateStatusForm.id,
                            status:this.updateStatusForm.status
                        };
                        postData.push(postDatas);

                        let listData={
                            data:postData
                        }
                        let data={
                            ssid:Cookies.get('ssid'),
                            data:JSON.stringify(listData)
                        };

                        $.ajax({
                            url: Config.apiRootPath+Config.api.management.Reviewmanagement.review,
                            type: 'POST',
                            dataType: 'json',
                            data: data
                        })
                            .done((data)=>{
                                this.saveUpdateStatusLoading=false;
                                //userTypeList
                                if(!!data){
                                    if(data.code==0){
                                        this.$Message.success("操作成功！");
                                        let newListData=$.extend(true, [], this.tableData);
                                        newListData[this.updateStatusForm.tableIndex]=this.updateStatusForm;
                                        this.updateStatusForm={};
                                        this.tableData=newListData;
                                        this.updateStatus = false;
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
                                this.savePassLoading=false;
                                Config.showError({vm:this,data:data,
                                    errorMsg:"服务器通讯失败"
                                });
                            });
                    }
                })
            }

        },
        mounted () {

        },
        activated (){
            this.doWhat("list");
        }
    };
</script>
