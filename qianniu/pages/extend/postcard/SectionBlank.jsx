import React, { useState, useEffect, useCallback } from "react";
// 组件库
import { Table } from "@alifd/next";
import "./index.less";

const SectionBlank = () => {
  const dataSource = [
    {
      id: 1,
      name: "邮费卡",
      time: "2023-05-30 14:20:27",
      price: "12",
      stock: "353",
      url: "https://item.taobao.com/item.htm?ft=t&id=720670439937",
      type: "邮费",
    },
    {
      id: 2,
      name: "不灭月卡",
      time: "2023-05-30 14:20:27",
      price: "112",
      stock: "999",
      url: "https://item.taobao.com/item.htm?ft=t&id=720670439937",
      type: "会员卡",
    },
    {
      id: 3,
      name: "皇冠卡",
      time: "2023-05-30 14:20:27",
      price: "172",
      stock: "3523233",
      url: "https://item.taobao.com/item.htm?ft=t&id=720670439937",
      type: "会员卡",
    },
    {
      id: 4,
      name: "星钻卡",
      time: "2023-05-30 14:20:27",
      price: "132",
      stock: "32432",
      url: "https://item.taobao.com/item.htm?ft=t&id=720670439937",
      type: "会员卡",
    },
    {
      id: 5,
      name: "白金卡",
      time: "2023-05-30 14:20:27",
      price: "35",
      stock: "353",
      url: "https://item.taobao.com/item.htm?ft=t&id=720670439937",
      type: "会员卡",
    },
  ];
  return (
    <div>
      <h1>明信片管理</h1>
      <Table dataSource={dataSource}>
        <Table.Column title="Id" dataIndex="id" />
        <Table.Column title="明信片名称" dataIndex="name" />
        <Table.Column title="编辑时间" dataIndex="time" />
        <Table.Column title="价格" dataIndex="price" />
        <Table.Column title="库存数量" dataIndex="stock" />
        <Table.Column title="淘宝链接" dataIndex="url" />
        <Table.Column title="明信片类型" dataIndex="type" />
      </Table>
    </div>
  );
};

export default SectionBlank;
