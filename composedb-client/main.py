import os
import json
import uvicorn
from fastapi import FastAPI, HTTPException, status
from db import cursor

PORT = os.getenv('GET_QUERY_PORT', 8000)
DB_TABLE_GITHUB = os.getenv('DB_TABLE_GITHUB')
DB_TABLE_FIVERR = os.getenv('DB_TABLE_FIVERR')
DB_TABLE_PLATFORM_RATING = os.getenv('DB_TABLE_PLATFORM_RATING')

app = FastAPI()


def fetch_from_db(query):
    result = None
    try:
        result = cursor.execute(query).fetchone()
    except Exception as e:
        print("Exception-1", e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Something went wrong.")

    if not result:
        print("Exception-2")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Not found.")
    print("Result", result)
    return result


def format_doc(doc):
    id, json_string = doc
    record = json.loads(json_string)
    record["id"] = id
    return record


@app.get("/get-github-profile/{user_acount}")
def get_github_profile(user_acount):
    # TECHDEBT
    # This API will be removed once composedb implements the feature to query with fields
    # https://forum.ceramic.network/t/queries-by-fields/260/6
    print("get_github_profile")
    query = f'''
        SELECT stream_id, stream_content 
        FROM {DB_TABLE_GITHUB} 
        WHERE json_extract(stream_content, '$.user_account')="{user_acount}"
    '''
    result = None
    try:
        result = fetch_from_db(query)
    except Exception as e:
        print("Exception", e)
        raise e
    record = format_doc(result)

    return record


@app.get("/fiverr-profile/{user_acount}")
def get_fiverr_profile(user_acount):
    # TECHDEBT
    # This API will be removed once composedb implements the feature to query with fields
    # https://forum.ceramic.network/t/queries-by-fields/260/6
    query = f'''
        SELECT stream_id, stream_content 
        FROM {DB_TABLE_FIVERR} 
        WHERE json_extract(stream_content, '$.user_account')="{user_acount}"
    '''
    result = None
    try:
        result = fetch_from_db(query)
    except Exception as e:
        print("Exception loading data for user {}".format(user_acount))
        raise e
    record = format_doc(result)

    return record


@app.get("/platform-rating/{platform}/{user_id}")
def get_platform_rating(platform, user_id):
    # TECHDEBT
    # This API will be removed once composedb implements the feature to query with fields
    # https://forum.ceramic.network/t/queries-by-fields/260/6
    query = f'''
        SELECT stream_id, stream_content
        FROM {DB_TABLE_PLATFORM_RATING}
        WHERE json_extract(stream_content, '$.platform_name')="{platform}" 
        AND json_extract(stream_content, '$.user_id')="{user_id}"
    '''
    result = None
    try:
        result = fetch_from_db(query)
    except Exception as e:
        raise e
    record = format_doc(result)

    return record


@app.get("/all-ratings-above/{platform}/{rating}")
def get_all_ratings(platform, rating):
    # TECHDEBT
    # This API will be removed once composedb implements the feature to query with fields
    # https://forum.ceramic.network/t/queries-by-fields/260/6
    # rating = int(rating)
    query = f'''
        SELECT stream_id, stream_content, json_extract(stream_content, '$.rating')
        FROM {DB_TABLE_PLATFORM_RATING}
        WHERE json_extract(stream_content, '$.platform_name')="{platform}" 
        AND json_extract(stream_content, '$.rating')>={rating}
    
    '''

    result = None
    try:
        result = fetch_from_db(query)
    except Exception as e:
        raise e
    record = format_doc(result)

    return record


if __name__ == "__main__":
    log_config = uvicorn.config.LOGGING_CONFIG
    log_config["formatters"]["access"]["fmt"] = "%(asctime)s - %(levelname)s - %(message)s"
    log_config["formatters"]["default"]["fmt"] = "%(asctime)s - %(levelname)s - %(message)s"
    uvicorn.run("main:app", port=int(PORT), reload=True,
                host="0.0.0.0", log_config=log_config, log_level="debug")
