import COCKATOO from "./../assests/cockatoo.png";
import './ImageWrapper.css';

const ImageWrapper = () => {

    return (
        <div className='image'>
            <img src={COCKATOO} alt='bird images cockatoo' />
        </div>
    )
}

export default ImageWrapper