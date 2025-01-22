export default function BurnCard({ time, address, amount }) {

    const handleAddress = (address) => {
        // Get the first 10 characters
        const first10 = address.slice(0, 10);

        // Get the last 10 characters
        const last10 = address.slice(-10);

        // Return the first 10, '...' for the middle, and the last 10 characters
        return `${first10}...${last10}`;
    };

    const shortenedAddress = handleAddress(address);
    return (
            <div className="flex flex-col md:flex-row md:gap-32 py-2">
                <h1 className="flex flex-row md:flex-col justify-between">
                    <span>Time</span>
                    <span>{time} </span>
                </h1>

                <h1 className="flex flex-row md:flex-col justify-between">
                    <span>Address</span>
                    <span>{shortenedAddress} </span>
                </h1>

                <h1 className="flex flex-row md:flex-col justify-between">
                    <span>$PHTs</span>
                    <span>{amount} </span>
                </h1>
            </div>
    );
}
