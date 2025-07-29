import { useDispatch, useSelector } from "react-redux";
import { addBookmark, removeBookmark } from "../reducers/bookmarks";
import Image from "next/image";
import styles from "../styles/Article.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { addHiddenArticles } from "../reducers/hiddenArticles";

function Article(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const handleHiddenArticlesClick = () => {
    dispatch(addHiddenArticles(props.title));
  };
  const handleBookmarkClick = () => {
    if (!user.token) {
      return;
    }
    fetch(`http://localhost:3000/users/canBookmark/${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("DATA", data);
        if (data.result && data.canBookmark) {
          if (props.isBookmarked) {
            dispatch(removeBookmark(props));
          } else {
            dispatch(addBookmark(props));
          }
        }
      });
  };

  let bookmarkIconStyle = {};
  let eyeSlashIconStyle = {};

  if (props.isBookmarked) {
    bookmarkIconStyle = { color: "#E9BE59" }; // Favori = jaune
  }

  // Optionnel : couleur si masqué
  if (props.isHidden) {
    eyeSlashIconStyle = { color: "#999" }; // Gris
  }

  return (
    <div className={styles.articles}>
      <div className={styles.articleHeader}>
        <h3>{props.title}</h3>
        <FontAwesomeIcon
          onClick={handleBookmarkClick}
          icon={faBookmark}
          style={bookmarkIconStyle}
          className={styles.bookmarkIcon}
        />
        <FontAwesomeIcon
          onClick={handleHiddenArticlesClick}
          icon={faEyeSlash}
          style={eyeSlashIconStyle}
          className={styles.eyeSlashIcon}
        />
      </div>
      <h4 style={{ textAlign: "right" }}>- {props.author}</h4>
      <div className={styles.divider}></div>
      <Image
        src={props.urlToImage}
        alt={props.title}
        width={600}
        height={314}
      />
      <p>{props.description}</p>
    </div>
  );
}

export default Article;
