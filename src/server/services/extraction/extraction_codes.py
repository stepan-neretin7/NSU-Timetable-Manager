from enum import auto

from model.utils import ZeroEnum


class ExtractionCodes(ZeroEnum):
    SUCCESS = auto()
    INTERNAL_ERROR = auto()
    UNKNOWN_GROUP = auto()
    UNKNOWN_ROOM = auto()
    UNKNOWN_TUTOR = auto()
