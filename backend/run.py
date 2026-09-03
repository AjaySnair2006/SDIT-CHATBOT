import uvicorn
import config

if __name__ == "__main__":
    print(f"Starting SDIT SmartBot Backend on http://{config.HOST}:{config.PORT} ...")
    uvicorn.run(
        "main:app",
        host=config.HOST,
        port=config.PORT,
        reload=True
    )
