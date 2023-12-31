import bs4

from model.dto import Times
from .parsing_exceptions import TimesParsingException
from .utils import create_html_bs4


class HTMLTimesParser:
    __error_message: str = 'Invalid format of HTML: cannot parse times'

    __times_tag_selector: str = 'div.modal-body table'
    __times_record_tag_name: str = 'tr'
    __times_tag_name: str = 'td'
    __times_limiter: str = '-'

    @staticmethod
    def parse_times(html_content: str) -> Times:
        soup: bs4.BeautifulSoup = create_html_bs4(html_content)

        times_tag: bs4.Tag = HTMLTimesParser.__find_times_tag(soup)
        if times_tag is None:
            raise TimesParsingException(HTMLTimesParser.__error_message)

        return HTMLTimesParser.__parse_times_from_tag(times_tag)

    @staticmethod
    def __parse_times_from_tag(times_tag: bs4.Tag) -> Times:
        times_list: list[str] = HTMLTimesParser.__parse_times_list_from_tag(times_tag)
        return Times(times_list)

    @staticmethod
    def __find_times_tag(soup: bs4.BeautifulSoup) -> bs4.Tag:
        return soup.select_one(HTMLTimesParser.__times_tag_selector)

    @staticmethod
    def __parse_times_list_from_tag(tag: bs4.Tag) -> list[str]:
        try:
            tags_of_records: bs4.ResultSet = tag.find_all(HTMLTimesParser.__times_record_tag_name)

            # This magic needs to extract only time when lessons begin. We get rid of time when lessons end
            # and when is the break between the halves of lesson.
            times_tags: list[bs4.Tag] = [tr.find_all(HTMLTimesParser.__times_tag_name)[1] for tr in tags_of_records]
            times_list: list[str] = [tag.text.split(HTMLTimesParser.__times_limiter)[0] for tag in times_tags]
        except IndexError as e:
            raise TimesParsingException(HTMLTimesParser.__error_message) from e

        return times_list
