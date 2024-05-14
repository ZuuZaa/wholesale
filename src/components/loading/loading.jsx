import './loading.scss';


const Loading = () => {
  return (
    <div className="loading-container">
        <div class="pulse-container">
          <div class="pulse-bubble pulse-bubble-1"></div>
          <div class="pulse-bubble pulse-bubble-2"></div>
          <div class="pulse-bubble pulse-bubble-3"></div>
        </div>
    </div>
  );
};

export default Loading