import styles from "./index.module.scss";

const Card = (props) => {
  return <div className={styles.card} {...props} />;
};

export default Card;
