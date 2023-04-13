import { useState } from "react";
import Card from "../card";
import styles from "./index.module.scss";
import { get, set } from "../../lib/session";

const Table = ({ tableId, headers, data }) => {
  // `col` field in headers represent for column width in grid-template-columns.
  const templateCols = headers.reduce(
    (template, header) => `${template} ${header.col ? header.col : "auto"}`,
    ""
  );

  const tableHeaders = headers.map((header, index) => (
    <div className={styles.gridHeader} key={index}>
      {header.value}
    </div>
  ));

  // If you want to render custom component inside table cell, use `render` field.
  const renders = headers.map((header) =>
    header.render
      ? { field: header.field, render: header.render }
      : { field: header.field, render: (value) => value }
  );

  // page and size are store in session storage so those values are persist when reload page.
  if (!get(tableId)) {
    set(tableId, { page: 1, size: 10 });
  }

  const [page, setPage] = useState(get(tableId).page);
  const [size, setSize] = useState(get(tableId).size);

  const paginate = (data) => {
    return data.slice((page - 1) * size, page * size);
  };

  const tableCells = paginate(data).flatMap((row, index) =>
    renders.map(({ field, render }) =>
      row[field] ? (
        <div key={`${field}${index}`} className={styles.gridCell}>
          {render(row[field])}
        </div>
      ) : (
        <div key={`${field}${index}`} className={styles.gridCell} />
      )
    )
  );

  const handleSetPage = (event) => {
    const page = parseInt(event.target.value);
    set(tableId, { page });
    setPage(page);
  };

  const handleSetSize = (event) => {
    const size = parseInt(event.target.value);
    set(tableId, { page: 1, size });
    setSize(size);
    setPage(1);
  };

  const pageCount = Math.ceil(data.length / size);

  /**
   * If number of pages less than or equal 7, display all buttons with number.
   * If number of pages larger than 7, we have 3 display cases.
   */
  const buttonClassName = (index) =>
    [
      styles.pageButton,
      page === index ? styles["pageButton--selected"] : "",
    ].join(" ");

  const pageButtons = (() => {
    if (!data.length) {
      return [];
    }
    if (pageCount <= 7) {
      return [...Array(pageCount).keys()].map((index) => (
        <button
          className={buttonClassName(index + 1)}
          key={index + 1}
          value={index + 1}
          onClick={handleSetPage}
        >
          {index + 1}
        </button>
      ));
    }
    if (page <= 4) {
      return [
        ...[1, 2, 3, 4, 5].map((index) => (
          <button
            className={buttonClassName(index)}
            key={index}
            value={index}
            onClick={handleSetPage}
          >
            {index}
          </button>
        )),
        <span className={styles.pageButtonSpan} key="right-span">
          ...
        </span>,
        <button
          className={buttonClassName(pageCount)}
          key={pageCount}
          value={pageCount}
          onClick={handleSetPage}
        >
          {pageCount}
        </button>,
      ];
    } else if (pageCount - page >= 4) {
      return [
        <button
          className={buttonClassName(1)}
          key={1}
          value={1}
          onClick={handleSetPage}
        >
          1
        </button>,
        <span className={styles.pageButtonSpan} key="left-span">
          ...
        </span>,
        ...[page - 1, page, page + 1].map((index) => (
          <button
            className={buttonClassName(index)}
            key={index}
            value={index}
            onClick={handleSetPage}
          >
            {index}
          </button>
        )),
        <span className={styles.pageButtonSpan} key="right-span">
          ...
        </span>,
        <button
          className={buttonClassName(pageCount)}
          key={pageCount}
          value={pageCount}
          onClick={handleSetPage}
        >
          {pageCount}
        </button>,
      ];
    } else {
      return [
        <button
          className={buttonClassName(1)}
          key={1}
          value={1}
          onClick={handleSetPage}
        >
          1
        </button>,
        <span className={styles.pageButtonSpan} key="left-span">
          ...
        </span>,
        ...[
          pageCount - 4,
          pageCount - 3,
          pageCount - 2,
          pageCount - 1,
          pageCount,
        ].map((index) => (
          <button
            className={buttonClassName(index)}
            key={index}
            value={index}
            onClick={handleSetPage}
          >
            {index}
          </button>
        )),
      ];
    }
  })();

  return (
    <Card>
      <div
        className={styles.gridContainer}
        style={{ gridTemplateColumns: templateCols }}
      >
        {tableHeaders}
        {tableCells}
      </div>
      <div className={styles.pagination}>
        <button className={styles.paginationTitle}>Phân trang:</button>
        <select className={styles.sizeSelect} onChange={handleSetSize}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <button
          className={styles.pageButton}
          disabled={page === 1}
          value={page - 1}
          onClick={handleSetPage}
        >
          ◁
        </button>
        {pageButtons}
        <button
          className={styles.pageButton}
          disabled={page === pageCount}
          value={page + 1}
          onClick={handleSetPage}
        >
          ▷
        </button>
      </div>
    </Card>
  );
};

export default Table;
