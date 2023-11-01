import { useNavigate } from "react-router-dom";
import styles from './styles.module.scss';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const Back = () => {
  const navigate = useNavigate();
	const goBack = () => {
		navigate(-1);
	}
  
  return (
    <button className={styles.back} onClick={goBack}>
      <KeyboardBackspaceIcon />
      <p>Back</p>
    </button>
  );
}

export default Back;