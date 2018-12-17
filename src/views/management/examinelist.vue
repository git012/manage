
<style lang="less">
    /*@import './merchant/merchant.less';*/
    .page-box{padding-top: 16px; text-align: center }
    .add-btu{ position: relative; float: right}
    .ivu-card-head p.hasButtonP{ overflow:visible;}
    .doBox{ position:relative}
    .small_table .ivu-table-cell{ padding-left:8px; padding-right: 8px}
    .small_table table th{ text-align:center}
    .shop-ewm{ position: absolute; right:0px; top:0px;width:180px; text-align: center;font-size:12px}
    .shop-ewm img{width:180px; height: auto; border:1px solid #dededf}
    .center{
        width: 100%;
        height: auto;
        padding-bottom: 50px;

    }
    .center:after{
        content: "";
        clear: both;
        display: block;
    }
    .left{
        width: 33%;
        float: left;
        height: auto;
        /*background: #00c261;*/
        border: 1px solid grey;
    }
    .left .bigImg{

    }
    .left ul{
        width: 100%;
        height: 100px;
        border-top: 1px solid grey;
        margin-top:0;
    }
    .left ul li{
        width: 100px;
        height: 100px;
        float: left;

    }
    .right{
        width: 65%;
        float: right;
        /*background: #2b81af;*/
        height: 500px;
    }
    .title{
        height: auto;
        line-height: 30px;
        border-bottom: 1px solid lightgray;
        padding-bottom: 10px;
        color: black;
    }
    .desc{
        display: inline-block;
        margin-right: 30px;
        font-size: 14px;
    }
</style>

<template>
    <div>
        <Card>
            <!--<Icon type="person"></Icon>-->
            <p slot="title" class="hasButtonP">
                <!--<Icon type="compose"></Icon>-->
                {{doName}}

            </p>

            <div class="doBox">
                <Spin size="large" fix v-if="switching"></Spin>
                <div class="ordler-list" v-if="doType=='list'">
                    <div class="search-box">
                        <Form ref="searchData" :model="searchData" :rules="searchValidata" inline style="display: inline-block">
                            <FormItem prop="keyword">
                                <Input type="text" v-model="searchData.keyword" placeholder="输入商品名称">
                                <Icon type="ios-eye" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <FormItem prop="searchDate">
                                <DatePicker type="daterange" v-model="searchData.searchDate" placeholder="请选择时间范围" style="width: 200px"></DatePicker>
                            </FormItem>
                            <Select v-model="searchData.shipStatus" style="width:140px" placeholder="选择审核状态">
                                <Option v-for="item,key in shipStatus" :value="key" :key="key">{{ item }}</Option>
                            </Select>
                            <Select @on-change="search()" v-model="searchData.type2" style="width:150px" placeholder="请选择商品类型">
                                <Option v-for="item in recordStatus2" :value="item.value" >{{ item.name }}</Option>
                            </Select>
                            <FormItem>
                                <ButtonGroup>
                                    <Button type="primary" icon="search" @click="search()">搜索</Button>
                                    <Button @click="resetSearch">清空</Button>
                                </ButtonGroup>
                            </FormItem>
                        </Form>

                    </div>
                    <Table class="small_table" border :columns="columns" :loading="getLoading" :data="tableData"></Table>
                    <div class="page-box">
                        <Page v-if="page.dataCount>10" :total="page.dataCount" :current="page.pageNumber" show-total :page-size-opts="page.pageSizeOpts" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator placement="top" show-sizer></Page>
                    </div>
                </div>
            </div>
            <Modal v-model="updateStatus" :closable='false' :mask-closable=false :width="500">
                <h3 slot="header" style="color:#2D8CF0">商品审核</h3>
                <Form ref="updateStatusForm" :model="updateStatusForm" :label-width="100" label-position="right" :rules="updateStatusValidate">
                    <FormItem label="商户名称：" style="margin-bottom:0px">
                        {{updateStatusForm.merchant_name}}
                    </FormItem>
                    <FormItem label="商品名称：" style="margin-bottom:0px">
                        {{updateStatusForm.name}}
                    </FormItem>
                    <FormItem label="商品价格：" style="margin-bottom:0px">
                        {{updateStatusForm.price}}
                    </FormItem>
                    <FormItem label="创建时间：" style="margin-bottom:0px">
                        {{updateStatusForm.date_added}}
                    </FormItem>


                    <FormItem label="审核状态：" prop="status">
                        <RadioGroup v-model="updateStatusForm.status">
                            <Radio label="1">
                                <span>通过</span>
                            </Radio>
                            <Radio label="2">
                                <span>拒绝</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="text" @click="cancelUpdateStatus">取消</Button>
                    <Button type="primary" :loading="saveUpdateStatusLoading" @click="saveUpdateStatus">保存</Button>
                </div>
            </Modal>
            <!--//商品详情-->
            <Modal v-model="modal2" width="900" style="height: 500px;">
                <p slot="header" style="color:#2d8cf0;text-align:center">
                    <!--<Icon type="information-circled"></Icon>-->
                    <span>商品详情</span>
                </p>
                <div class="center" v-model="thisIndex" style="height: 500px;overflow-y: scroll; ">
                    <div class="left">
                        <div class="bigImg" style="height: auto;">
                          <!--{{thisIndex.image}}-->
                            <img :src="thisIndex.image" alt="" style="width: 100%;height: auto;margin: 0;padding: 0">
                        </div>
                        <ul>
                            <li v-for="site in thisIndex.images" style="list-style: none">

                                <img :src="site.image" alt="" width="100" height="100" @click="imgView">
                            </li>

                        </ul>
                    </div>
                    <div class="right">
                        <h1 class="title">{{thisIndex.name}}</h1>
                        <Row style="margin-top: 10px" align="bottom" type="flex">
                            <Col span="4" style="font-size: 16px;color: black">商品描述:</Col>
                            <Col span="20" style="font-size: 14px">{{thisIndex.description}}</Col>
                        </Row>

                        <Alert type="error" style="margin-top: 10px">

                            <span slot="desc" class="desc">
                                单价(元): <em>{{thisIndex.price}}</em>
                            </span>
                            <span slot="desc" class="desc">
                                数量: <code>{{thisIndex.quantity}}</code>
                            </span>
                            <span slot="desc" class="desc">
                                运费(元): <code>{{thisIndex.logistics_price}}</code>
                            </span>
                            <span slot="desc" class="desc">
                                排序: <code>{{thisIndex.sort_order}}</code>
                            </span>
                        </Alert>
                        <Row style="margin-top: 10px" align="bottom" type="flex">
                            <Col span="4" style="font-size: 16px;color: black">配送:</Col>
                            <Col span="20" style="font-size: 14px" v-if="thisIndex.carriage_type==1">
                                包邮

                            </Col>
                            <Col span="20" style="font-size: 14px" v-if="thisIndex.carriage_type==2">
                                全国统一邮费

                            </Col>
                            <Col span="20" style="font-size: 14px" v-if="thisIndex.carriage_type==3">
                                新疆、西藏用户需附加邮费

                            </Col>

                        </Row>
                        <Row style="margin-top: 10px" align="bottom" type="flex">
                            <Col span="4" style="font-size: 16px;color: black">商户名称 :</Col>
                            <Col span="20" style="font-size: 14px">
                               {{thisIndex.merchant_name}}

                            </Col>


                        </Row>
                        <Row style="margin-top: 10px" align="top" type="flex">
                            <Col span="4" style="font-size: 16px;color: black">商品规格 :</Col>
                            <Col span="20" style="font-size: 14px">
                            	<template v-if="this.showSize">
                            		<span>{{thisIndex.product_option_values[0].option_name}}：</span>
                                	<span style="background: #fbd9d0;margin-bottom: 10px;color: black;display: inline-block;padding: 3px 10px;border-radius: 3px;margin-right: 5px" v-for="item in thisIndex.product_option_values">{{item.option_value_name}}</span><br>
                            	</template>
                            	<template v-if="this.showSize && thisIndex.product_option_values[0].option_name_2">
                            		<span>{{thisIndex.product_option_values[0].option_name_2}}：</span>
                                	<span style="background: #fbd9d0;color: black;display: inline-block;padding: 3px 10px;border-radius: 3px;margin-right: 5px" v-for="item in thisIndex.product_option_values" v-if="thisIndex.product_option_values!=null">{{item.option_value_name_2}}</span>
                            	</template>
                            </Col>


                        </Row>
                        <!--{{thisIndex.category.length}}-->
                        <Row style="margin-top: 10px" align="top" type="flex" v-if="feilei">
                            <Col span="4" style="font-size: 16px;color: black">商品分类 :</Col>
                            <Col span="20" style="font-size: 14px" v-if="thisIndex.category&&thisIndex.category.length>1">
                                {{thisIndex.category[0].category}}/{{thisIndex.category[1].parent_category}}



                            </Col>
                            <Col span="20" style="font-size: 14px" v-if="thisIndex.category&&thisIndex.category.length<=1">
                                <!--{{thisIndex.category}}-->
                                {{thisIndex.category[0].parent_category}}



                            </Col>


                        </Row>
                        <Row style="margin-top: 10px" align="top" type="flex">
                            <Col span="4" style="font-size: 16px;color: black">审核状态 :</Col>
                            <Col span="20" style="font-size: 14px" v-if="thisIndex.status==0">
                                未审核
                            </Col>
                            <Col span="20" style="font-size: 14px" v-if="thisIndex.status==1">
                                审核通过
                            </Col>
                            <Col span="20" style="font-size: 14px" v-if="thisIndex.status==2">
                                拒绝
                            </Col>


                        </Row>
                        <Row style="margin-top: 10px" align="top" type="flex">
                            <Col span="4" style="font-size: 16px;color: black">录入人 :</Col>
                            <Col span="20" style="font-size: 14px">{{thisIndex.data_entry_clerk}}</Col>
                        </Row>
                        <Row style="margin-top: 10px" align="top" type="flex">
                            <Col span="4" style="font-size: 16px;color: black">创建时间 :</Col>
                            <Col span="20" style="font-size: 14px">

                                {{thisIndex.date_added}}
                            </Col>



                        </Row>



                    </div>
                </div>
                <div slot="footer">
                    <Button type="success" size="large" long @click="del">关闭</Button>
                </div>
            </Modal>
            <!--优惠-->
            <!--<Modal v-model="Ymodal" :closable='false' :mask-closable=false :width="500"  >-->
                <!--<h3 slot="header" style="color:#2D8CF0">商品审核</h3>-->

                <!--<Form ref="Ydata" :model="Ydata" :label-width="100" label-position="right" :rules="updateStatusValidate">-->
                    <!--<FormItem label="商户名称：" style="margin-bottom:0px">-->
                        <!--{{Ydata.row.merchant_name}}-->
                    <!--</FormItem>-->
                    <!--<FormItem label="商品名称：" style="margin-bottom:0px">-->
                        <!--{{Ydata.row.name}}-->
                    <!--</FormItem>-->
                    <!--<FormItem label="排序：" style="margin-bottom:0px">-->
                        <!--&lt;!&ndash;{{Tdata.row.order}}&ndash;&gt;-->
                    <!--</FormItem>-->

                    <!--<FormItem label="上架状态：" prop="status">-->
                        <!--<RadioGroup v-model="Tdata.status">-->
                            <!--<Radio label="1">-->
                                <!--<span>上架</span>-->
                            <!--</Radio>-->
                            <!--<Radio label="0">-->
                                <!--<span>下架</span>-->
                            <!--</Radio>-->
                        <!--</RadioGroup>-->
                    <!--</FormItem>-->
                <!--</Form>-->
                <!--<div slot="footer">-->
                    <!--<Button type="text" @click="Yclose">取消</Button>-->
                    <!--<Button type="primary" :loading="saveUpdateStatusLoading" @click="saveUpdateStatus">保存</Button>-->
                <!--</div>-->
            <!--</Modal>-->
            <!--推荐-->

        </Card>
    </div>
</template>

<script>
    /* eslint-disable space-infix-ops,padded-blocks */

    import Config from '../../config/config';
    import Util from '../../libs/util';
    import Cookies from 'js-cookie';
    import MD5 from '../../libs/md5';

    export default {
        name: 'examinelist',
        data: function () {
            const valideCashStatus = (rule, value, callback) => {
                // console.log(value);
                if (value == 1 || value == 2) {
                    callback();
                } else {
                    callback(new Error(rule.message));
                }
            };
            return {
                tableOptions: {
                    width: '100%'
                },
                Tmodal:false,
                Ymodal:false,
                modal2: false,
                feilei:false,
                showSize:false,
                Tdata:{},
                Ydata:{},
                columns: [
                    {
                        title: '商户名称',
                        // width: "10%",
                        key: 'merchant_name'
                    },
                    {
                        title: '商品名称',
                        width:400,
                        // width: "15%",
                        key: 'name'
                    },
                    {
                        title: '商品价格',
                        // width: "12%",
                        key: 'price',
                        align:'center'
                    },
                    {
                        title: '白积分价格',
                        // width: "12%",
                        key: 'price_integral',
                        align:'center'
                    },
                    {
                        title: '创建时间',
                        // width: "12%",
                        key: 'date_added'
                    },
                    {
                        title: '优惠',
                        key: 'is_discount',
                        // width: '100',
                        align: 'center',
                        render: (h, params) => {

                            let tagcolor = 'primary';
                            let tagText = '优惠';
                            if (params.row.is_discount == 0) {
                                tagcolor = 'primary';
                                tagText = '优惠';
                            }
                            ;
                            if (params.row.is_discount == 1) {
                                tagcolor = 'error';
                                tagText = '取消';
                            }

                            return h('Button', {
                                props: {
                                    type: tagcolor,
                                    size: 'small'

                                },
                                on: {
                                    click: () => {
                                         this.discount(params.row,params.row.is_discount,'优惠');

                                    }
                                },
                            }, tagText);

                        }
                    },
                    {
                        title: '推荐',
                        key: 'is_recommend',
                        // width: '100',
                        align: 'center',
                        render: (h, params) => {

                            let tagcolor = 'primary';
                            let tagText = '推荐';
                            // console.log(params.row.is_recommend);
                            if (params.row.is_recommend == 0) {
                                tagcolor = 'primary';
                                tagText = '推荐';
                            }
                            ;
                            if (params.row.is_recommend == 1) {
                                tagcolor = 'error';
                                tagText = '取消';
                            }
                            ;

                            return h('Button', {
                                props: {
                                    type: tagcolor,
                                    size: 'small'
                                },
                                on: {
                                    click: () => {

                                        this.discount(params.row,params.row.is_recommend,'推荐');
                                    }
                                }


                            }, tagText);

                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        // width: '100',
                        align: 'center',
                        render: (h, params) => {

                            let tagcolor = 'default';
                            let tagText = '申请中';
                            if (params.row.status == 0) {
                                tagcolor = 'default';
                                tagText = '未审核';
                            }
                            ;
                            if (params.row.status == 1) {
                                tagcolor = 'green';
                                tagText = '通过';
                            }
                            ;
                            if (params.row.status == 2) {
                                tagcolor = 'red';
                                tagText = '失败';
                            }
                            ;
                            return h('Tag', {
                                props: {
                                    color: tagcolor,
                                    size: 'small'
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
                            let viewButton = h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {

                                        this.doWhat('view', params);
                                    }
                                }
                            }, '详情');
                            let setButton = h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {

                                        this.doWhat('view', params);
                                    }
                                }
                            }, '设置');

                            let deleteButton = h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.doWhat('review', params.index);
                                    }
                                }
                            }, '审核');

                            let dobutton = [];

                            // if (this.checkPower('edit')) dobutton.push(editButton);
                            if (this.checkPower('review') && params.row.status == 0) {
                                dobutton.push(deleteButton);
                            };

                            dobutton.push(viewButton);
                            return h('div', dobutton);
                        }
                    }
                ],
                saveType: 'new',
                doType: 'list',
                switching: false,
                thisIndex: {},
                tableData: [],
                merchantTypeData: [],
                areaData: {
                    areaDataReady: 3,
                    province: [],
                    citys: [],
                    district: []
                },
                shipStatus: ['待审核', '审核成功', '审核失败'],
                recordStatus2:[{"value":"2","name":"普通商品"},{"value":"1","name":"积分商品"}],
                Totals: {
                    wait: '0.00',
                    fail: '0.00',
                    success: '0.00',
                    sum_total: '0.00'
                },
                page: {
                    dataCount: 0,
                    pageCount: 0,
                    pageSize: 10,
                    pageNumber: 1,
                    pageSizeOpts: [10, 20, 50, 100]
                },
                dataReady: 0,
                currentData: {},
                defaultData: {
                    'id': 8,
                    'merchant_id': 1,
                    'merchant_name': '',
                    'bank_id': 1111,
                    'total': '1.0000',
                    'status': 0,
                    'comment': '',
                    'date_added': '2017-11-16 16:00:20',
                    'bank_name': '',
                    'bank_number': ''
                },
                updateStatusForm: {},
                updateStatusValidate: {
                    status: [
                        {validator: valideCashStatus, message: '请选择审核结果', trigger: 'blur'}
                    ]
                },
                oldPassError: '',
                updateStatus: false, // 修改密码模态框显示
                saveUpdateStatusLoading: false,
                searchData: {
                    keyword: '',
                    searchDate: [],
                    startDate: '',
                    endDate: '',
                    type: 0,
                    type2:''
                },
                searchValidata: {},
                value:"",
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
                if (this.doType=="list") return '商品审核';
                // if (this.doType=="edit") return "编辑商户";
                // if (this.doType=="add") return "添加商户";
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


            //优惠{}
            discount(index,state,title){
                let order=0;
                let url='';
                let is_recommend=1;
                let is_discount=1;
                if(state==0){
                    state==1;
                    order=9999;
                    is_recommend=1;
                    is_discount=1;

                }else{
                    state==0
                    order=0;
                    is_recommend=0;
                    is_discount=0;
                };
                let postData={

                };
                if(title=="推荐"){
                    // console.log(title);
                    url=Config.apiRootPath+Config.api.management.examinelist.t;

                     postData.ssid=Cookies.get('ssid'),
                        postData.order=order,
                        postData.id=index.id,
                        postData.is_recommend=is_recommend

                }else{
                    url=Config.apiRootPath+Config.api.management.examinelist.h;
                        postData.ssid=Cookies.get('ssid'),
                        // order:order,
                        postData.id=index.id,
                        postData.is_discount=is_discount

                }
                $.ajax({
                    url: url,
                    type: 'POST',
                    dataType: 'json',
                    data: postData
                })
                    .done((data)=>{
                        // this.dataReady--;
                        // getList
                        if(!!data){
                            if(data.code==0){
                                this.$Message.success('操作成功');
                                this.doWhat('list');

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


            // 关闭详情
            del () {
                this.modal2 = false;
            },
            imgView () {
                // alert('a');
                this.thisIndex.image=event.target.src;
                // console.log(event.target.src);

            },
            // controller
            checkPower (dotype) {
                return !!this.$store.state.Rights[Config.api.management.examinelist[dotype].MD5()];
            },
            doWhat: function (dotype, dataIndex) {
                // console.log(this.checkPower(dotype));
                console.log(dotype);
                if (dotype == 'view') {
                    // this.resetCurrentData();
                    this.details(dataIndex);
                    return;
                }
                if (!this.checkPower(dotype)) {
                    this.$Message.warning('对不起，您没有此操作权限！');
                    return;
                }
                this.switching = true;
                if (dotype === 'add') {
                    this.resetCurrentData();
                    this.doType = 'add';
                }
                ;
                if (dotype === 'edit') {
                    this.showEdit(dataIndex);
                    this.doType = 'edit';
                }
                ;
                if (dotype === 'delete') {
                    this.delete(dataIndex);
                }
                ;
                if (dotype === 'review') {
                    this.changeStatus(dataIndex);
                }
                ;
                if (dotype === 'list') {
                    this.resetCurrentData();
                    this.dataReady += 1;
                    this.init();
                    this.doType = 'list';
                }
                ;

                this.switching = false;
            },
            view (index) {
                this.currentData=$.extend(true, {}, this.tableData[index]);
                this.doType = 'view';
            },

            // 商品详情
            showEdit: function (index) {
                this.currentData = $.extend(true, {}, this.tableData[index]);
                this.currentData.userewm = Config.apiRootPath + Config.api.public.ewm + '&merchantId=' + this.currentData.merchantId;
                this.setCity(this.currentData.merchantProvinceId, true);
                this.setDistrict(this.currentData.merchantCityId, true);
                this.doType = 'edit';
            },
            resetCurrentData () {
                this.currentData = $.extend(true, {}, this.defaultData);
            },
            // comm
            details: function (index) {
            	this.showSize=false;
                this.modal2 = true;
                this.thisIndex = index.row;
                if(this.thisIndex.product_option_values.length>0){
                	this.showSize=true;
                }
            },
            changePage (pageNumber){
                this.page.pageNumber=pageNumber;
                this.search(pageNumber);
            },
            changePageSize (pageSize){
                this.page.pageSize=pageSize;
                this.page.pageCount=Math.ceil(this.page.dataCount/this.page.pageSize);
                this.search();
            },
            // list
            resetSearch: function () {
                this.searchData = {
                    keyword: '',
                    searchDate: [],
                    startDate: '',
                    endDate: '',
                    type: 0
                };
                this.page.pageNumber = 1;
                this.dataReady += 1;
                this.init();
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
            init () {
                this.getList();
            },
            getList () {
                let postData={
                    ssid:Cookies.get('ssid'),
                    page:this.page.pageNumber,
                    pageSize:this.page.pageSize
                };
                if(this.searchData.keyword!="")postData.name=Util.trim(this.searchData.keyword);
                if(this.searchData.startDate!="")postData.startDate=this.searchData.startDate;
                if(this.searchData.shipStatus>=0)postData.status=this.searchData.shipStatus;
                if(this.searchData.endDate!="")postData.endDate=this.searchData.endDate;
            	if(this.searchData.type2!='')postData.is_integral=this.searchData.type2;
                if(this.searchData.startDate!="")postData.startDate=this.searchData.startDate;
                $.ajax({
                    url: Config.apiRootPath+Config.api.management.examinelist.list,
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
                                    data.data.list[i].price=Number(data.data.list[i].price).toFixed(2);
                                }
                                this.tableData=data.data.list;
                                this.feilei=true;
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
            getMerchantType () {
                let postData={
                    ssid:Cookies.get('ssid'),
                    page:this.page.pageNumber,
                    pageSize:this.page.pageSize
                };
                $.ajax({
                    url: Config.apiRootPath+Config.api.public.merchantType,
                    type: 'POST',
                    dataType: 'json',
                    data: postData
                })
                    .done((data)=>{
                        // getBankCardList
                        this.dataReady--;
                        if(!!data){
                            if(data.code==0){
                                let typelist=[];
                                for (let item in data.data){
                                    typelist.push({ value: parseInt(item) ,label: data.data[item]});
                                }
                                this.merchantTypeData=typelist;
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
            //edit password
            changeStatus (index) {
                this.updateStatusForm=$.extend(true, {}, this.tableData[index]);
                this.updateStatusForm.tableIndex=index;
                this.updateStatus = true;
            },
            cancelUpdateStatus () {
                this.updateStatusForm={};
                this.updateStatus = false;
            },
            saveUpdateStatus () {
                this.$refs['updateStatusForm'].validate((valid) => {
                    if (valid) {

                        this.saveUpdateStatusLoading = true;
                        let postData={
                            ssid:Cookies.get('ssid'),
                            id:this.updateStatusForm.id,
                            status:this.updateStatusForm.status
                        };

                        $.ajax({
                            url: Config.apiRootPath+Config.api.management.examinelist.review,
                            type: 'POST',
                            dataType: 'json',
                            data: postData
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
        activated: function () {
            this.doWhat('list');
        }
    };
</script>

