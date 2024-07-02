"""Remove email verification fields to User model

Revision ID: e87966920f77
Revises: fc265f3451f4
Create Date: 2024-06-28 21:53:22.351930

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'e87966920f77'
down_revision = 'fc265f3451f4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_index('verification_token')
        batch_op.drop_column('verification_token')
        batch_op.drop_column('email_verified')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('email_verified', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('verification_token', mysql.VARCHAR(length=100), nullable=True))
        batch_op.create_index('verification_token', ['verification_token'], unique=True)

    # ### end Alembic commands ###
