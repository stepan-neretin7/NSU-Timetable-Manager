from typing import List

import bs4

from common import ServerCodes, ServerResponse, create_error_server_response, Times


class HTMLTimesParser:
    @staticmethod
    def parse_times(html_content: str) -> ServerResponse:
        error_message: str = 'Invalid format of HTML: cannot parse times'

        soup: bs4.BeautifulSoup = bs4.BeautifulSoup(markup=html_content, features='html.parser')

        times_tag: bs4.Tag = soup.find(name='div', attrs={'class': 'modal-body'})
        if times_tag is None:
            return create_error_server_response(message=error_message, code=ServerCodes.INTERNAL_ERROR)

        try:
            times_list: List[str] = [tr.find_all('td')[1].text.split('-')[0] for tr in times_tag.find_all('tr')]
        except IndexError:
            return create_error_server_response(error_message, ServerCodes.INTERNAL_ERROR)

        return ServerResponse(Times(times=times_list))
