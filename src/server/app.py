import uvicorn
from fastapi import FastAPI

from extraction import Extractor
from extraction.html_extraction import HTMLExtractor

from routing import Routes

app = FastAPI()

extractor: Extractor = HTMLExtractor()
routes: Routes = Routes(extractor)
app.include_router(routes.router)

if __name__ == '__main__':
    uvicorn.run('main:app')
