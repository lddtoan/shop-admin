import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { getProducts } from "../../services/api/home";
import Card from "../../components/card";
import Table from "../../components/table";
import { get, set } from "../../lib/session";
import styles from "./index.module.scss";

const Home = () => {
  if (get("type") === null) {
    set("type", { value: "all" });
  }
  if (get("search") === null) {
    set("search", { value: "" });
  }

  const [submit, setSubmit] = React.useState(false);

  const handleChangeType = (event) => {
    set("type", { value: event.target.value });
  };

  const handleChangeSearch = (event) => {
    set("search", { value: event.target.value });
  };

  const filter = (query) => {
    if (!query.data) {
      return [];
    }
    if (get("type").value === "all") {
      return query.data.filter(
        (item) =>
          item.title.includes(get("search").value) ||
          item.brand.includes(get("search").value) ||
          item.description.includes(get("search").value)
      );
    }
    if (get("type").value === "title") {
      return query.data.filter((item) =>
        item.title.includes(get("search").value)
      );
    }
    if (get("type").value === "brand") {
      return query.data.filter((item) =>
        item.brand.includes(get("search").value)
      );
    }
    if (get("type").value === "description") {
      return query.data.filter((item) =>
        item.description.includes(get("search").value)
      );
    }
  };

  const query = useQuery("get-products", getProducts);

  const data = filter(query);

  useEffect(() => {
    if (submit) {
      setSubmit(false);
    }
  }, [submit]);

  const headers = [
    {
      value: "Mã",
      col: "2fr",
      field: "id",
    },
    {
      value: "Tên",
      col: "2fr",
      field: "title",
    },
    {
      value: "Hãng",
      col: "2fr",
      field: "brand",
    },
    {
      value: "Mô tả",
      col: "3fr",
      field: "description",
      render: (value) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "35ch",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {value}
            </div>
          </div>
        );
      },
    },
    {
      value: "Giá",
      col: "1fr",
      field: "price",
    },
    {
      value: "Đánh giá",
      col: "1fr",
      field: "rating",
    },
    {
      value: "Số lượng",
      col: "1fr",
      field: "stock",
    },
  ];

  return (
    <div className={styles.app}>
      <Card style={{ paddingLeft: "16px" }}>
        <h4>Quản lý kho hàng</h4>
        <div className={styles.filter}>
          <span className={styles.filterTitle}>Lọc:</span>
          <select
            className={styles.filterType}
            defaultValue={get("type").value}
            onChange={handleChangeType}
          >
            <option value="all">Tất cả</option>
            <option value="title">Tên</option>
            <option value="brand">Hãng</option>
            <option value="description">Mô tả</option>
          </select>
          <input
            className={styles.filterSearch}
            type="text"
            defaultValue={get("search").value}
            onChange={handleChangeSearch}
          />
          <button
            className={styles.filterSubmit}
            onClick={() => setSubmit(true)}
          >
            Tìm
          </button>
        </div>
      </Card>
      <p>Tổng: {data.length}</p>
      <Table tableId="admin-table" headers={headers} data={data} />
    </div>
  );
};

export default Home;
