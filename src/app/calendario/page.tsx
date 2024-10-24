import Reloj from "@/components/reloj/reloj";

const Calendario = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col justify-between">
            <div className="flex justify-between w-full">
                <div className="ml-4">
                    <h1 className="text-3xl font-bold">
                        Calendario
                    </h1>
                </div>
                <div className="text-2xl mr-4">
                    <Reloj />
                </div>
            </div>
        </div>
    );
}

export default Calendario;
