function VideoBackground() {
  return (
    <video autoPlay muted loop className="absolute w-full h-full object-cover">
      <source src="/bg-video.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

export default VideoBackground;
