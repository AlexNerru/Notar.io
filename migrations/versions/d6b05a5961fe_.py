"""empty message

Revision ID: d6b05a5961fe
Revises: 
Create Date: 2018-07-09 00:50:45.033451

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd6b05a5961fe'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('address', sa.String(length=120), nullable=False),
    sa.Column('name', sa.String(length=30), nullable=False),
    sa.Column('second_name', sa.String(length=30), nullable=True),
    sa.Column('surname', sa.String(length=30), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=True),
    sa.Column('password_hash', sa.String(length=128), nullable=True),
    sa.Column('type', sa.String(length=20), nullable=True),
    sa.Column('license', sa.String(length=50), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('address')
    )
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)
    op.create_table('agreement',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('address', sa.String(length=120), nullable=False),
    sa.Column('document', sa.String(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('agreement')
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_table('user')
    # ### end Alembic commands ###
