<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Row>
            <Col span="8">       
                <Row>
                    <Card>
                        <Row type="flex" class="user-infor">
                            <Col span="8">
                                <Row class-name="made-child-con-middle" type="flex" align="middle">
                                    <img class="avator-img" :src="avatorPath" />
                                </Row>
                            </Col>
                            <Col span="16" style="padding-left:6px;">
                                <Row class-name="made-child-con-middle" type="flex" align="middle">
                                    <div>
                                        <b class="card-user-infor-name">{{userInfro.name}}</b>
                                        <p>{{userInfro.group}}</p>
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </Row>
            </Col>
            <Col span="16" class-name="padding-left-5">
                <Row v-if="dataComplete">
                    <Col span="12">
                        <infor-card
                            id-name="user_created_count"
                            :end-val="count.total_new_user"
                            iconType="person-add"
                            color="#2d8cf0"
                            intro-text="今日新增用户数量"
                        ></infor-card>
                    </Col>
                    <Col span="12" class-name="padding-left-5">
                        <infor-card
                            id-name="visit_count"
                            :end-val="count.total_new_merchant"
                            iconType="star"
                            color="#64d572"
                            :iconSize="50"
                            intro-text="今日新增商户数量"
                        ></infor-card>
                    </Col>
                </Row> 
                <Row v-if="dataComplete" class-name="margin-top-10">
                    <Col span="12">
                        <infor-card
                            id-name="collection_count"
                            :end-val="count.total_user"
                            iconType="person"
                            color="#ffd572"
                            intro-text="用户总数量"
                        ></infor-card>
                    </Col>
                    <Col span="12" class-name="padding-left-5">
                        <infor-card
                            id-name="transfer_count"
                            :end-val="count.total_merchant"
                            iconType="nuclear"
                            color="#f25e43"
                            intro-text="商户总数量"
                        ></infor-card>
                    </Col>
                </Row>
            </Col>    
        </Row>
    </div>
</template>

<script>
import dataSourcePie from './components/dataSourcePie.vue';
import serviceRequests from './components/serviceRequests.vue';
import userFlow from './components/userFlow.vue';
import countUp from './components/countUp.vue';
import inforCard from './components/inforCard.vue';
import Cookies from 'js-cookie';
import Config from '../../config/config';

export default {
    name: 'home_index',
    components: {
        dataSourcePie,
        serviceRequests,
        userFlow,
        countUp,
        inforCard
    },
    data () {
        let userInfro={
            name:Cookies.get('user'),
            group:Cookies.get('user_group_name')
        };
        return {
            userInfro:userInfro,
            count: {
                total_user: 0,
                total_new_user: 0,
                total_merchant: 0,
                total_new_merchant: 0
            },
            dataComplete: false,
            newToDoItemValue: ''
        };
    },
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        }
    },
    methods: {
        addNewToDoItem () {
            this.showAddNewTodo = true;
        },
        addNew () {
            if (this.newToDoItemValue.length !== 0) {
                this.toDoList.unshift({
                    title: this.newToDoItemValue
                });
                setTimeout(() => {
                    this.newToDoItemValue = '';
                }, 200);
                this.showAddNewTodo = false;
            } else {
                this.$Message.error('请输入待办事项内容');
            }
        },
        cancelAdd () {
            this.showAddNewTodo = false;
            this.newToDoItemValue = '';
        },
        setCount () {
            let _this=this;
            let postData={
                    ssid:Cookies.get('ssid')
                };
            $.ajax({
                url: Config.apiRootPath+Config.api.home_index.count,
                type: 'POST',
                dataType: 'json',
                data: postData
            })
            .done((data)=>{
                // data={
                //         "code": 0,
                //         "message": "",
                //         "data": {
                //             "newMemberCount": 0,
                //             "memberTotal": 1,
                //             "newMerchantCount": 0,
                //             "merchantTotal": 1
                //         }
                //     };
                if(!!data){
                    if(data.code==0){

                        this.count.total_new_user+=data.data.newMemberCount;
                        this.count.total_user+=data.data.memberTotal;
                        this.count.total_new_merchant+=data.data.newMerchantCount;
                        this.count.total_merchant+=data.data.merchantTotal;
                        this.dataComplete=true;

                    }else{
                        Config.showError({vm:this,data:data,
                            errorMsg:""
                        });
                    }
                }else{
                    Config.showError({vm:this,data:data,
                        errorMsg:"数据获取错误，请刷新重试"
                    });
                }
            });
        }
    },
    created () {
        this.setCount();
    }
};
</script>
