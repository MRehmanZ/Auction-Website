const Auction = ({ name, description, price, condition, category }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        alt="Auction Item 1"
        className="w-full h-60 object-cover"
        height={300}
        src="/placeholder.svg"
        style={{
          aspectRatio: "400/300",
          objectFit: "cover",
        }}
        width={400}
      />
      <div className="p-4">
        <h2 className="text-lg font-bold mb-2">{name}</h2>
        <p className="text-gray-500 mb-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">£{price}</span>
          <div className="flex items-center space-x-2">
            <span className="text-green-500 font-medium">{condition}</span>
            <span className="text-gray-500 font-medium">{category}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auction;
